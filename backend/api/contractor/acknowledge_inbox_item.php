<?php
header('Content-Type: application/json');
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if ($origin) { header('Access-Control-Allow-Origin: ' . $origin); header('Vary: Origin'); } else { header('Access-Control-Allow-Origin: http://localhost'); }
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); header('Access-Control-Max-Age: 86400'); exit; }

require_once '../../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $input = json_decode(file_get_contents('php://input'), true) ?: [];
    $id = isset($input['id']) ? (int)$input['id'] : 0;
    $contractorId = isset($input['contractor_id']) ? (int)$input['contractor_id'] : 0;
    $dueDate = isset($input['due_date']) ? trim((string)$input['due_date']) : null; // YYYY-MM-DD
    if ($id <= 0 || $contractorId <= 0) {
        echo json_encode(['success' => false, 'message' => 'Missing id or contractor_id']);
        exit;
    }

    // Ensure columns exist
    try {
        $cols = $db->query("SHOW COLUMNS FROM contractor_layout_sends")->fetchAll(PDO::FETCH_COLUMN, 0);
        if ($cols && !in_array('acknowledged_at', $cols)) {
            $db->exec("ALTER TABLE contractor_layout_sends ADD COLUMN acknowledged_at DATETIME NULL AFTER created_at");
        }
        if ($cols && !in_array('due_date', $cols)) {
            $db->exec("ALTER TABLE contractor_layout_sends ADD COLUMN due_date DATE NULL AFTER acknowledged_at");
        }
    } catch (Throwable $e) {}

    // First, get the homeowner_id and layout details for notification
    $getItemStmt = $db->prepare("SELECT homeowner_id, layout_id, design_id, payload FROM contractor_layout_sends WHERE id = :id AND contractor_id = :cid");
    $getItemStmt->bindValue(':id', $id, PDO::PARAM_INT);
    $getItemStmt->bindValue(':cid', $contractorId, PDO::PARAM_INT);
    $getItemStmt->execute();
    $itemData = $getItemStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$itemData) {
        echo json_encode(['success' => false, 'message' => 'Item not found']);
        exit;
    }
    
    $homeownerId = $itemData['homeowner_id'];

    $sql = "UPDATE contractor_layout_sends SET acknowledged_at = NOW(), due_date = :due WHERE id = :id AND contractor_id = :cid";
    $stmt = $db->prepare($sql);
    $stmt->bindValue(':due', $dueDate ?: null, $dueDate ? PDO::PARAM_STR : PDO::PARAM_NULL);
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->bindValue(':cid', $contractorId, PDO::PARAM_INT);
    $stmt->execute();

    // Create notification for homeowner if they exist
    if ($homeownerId) {
        try {
            // Get contractor details
            $contractorStmt = $db->prepare("SELECT first_name, last_name, email FROM users WHERE id = :id");
            $contractorStmt->bindValue(':id', $contractorId, PDO::PARAM_INT);
            $contractorStmt->execute();
            $contractorData = $contractorStmt->fetch(PDO::FETCH_ASSOC);
            $contractorName = trim(($contractorData['first_name'] ?? '') . ' ' . ($contractorData['last_name'] ?? '')) ?: 'Contractor';
            
            // Ensure homeowner_notifications table exists
            $db->exec("CREATE TABLE IF NOT EXISTS homeowner_notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                homeowner_id INT NOT NULL,
                contractor_id INT NULL,
                type VARCHAR(50) DEFAULT 'acknowledgment',
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                status ENUM('unread', 'read') DEFAULT 'unread',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX(homeowner_id), INDEX(status), INDEX(type)
            )");
            
            // Insert notification
            $ackTime = date('Y-m-d H:i:s');
            $ackDate = $dueDate ? date('F j, Y', strtotime($dueDate)) : 'not specified';
            $title = "Contractor Acknowledged Your Layout";
            $message = "{$contractorName} acknowledged your layout at {$ackTime}.\nDue date: {$ackDate}";
            
            $notifStmt = $db->prepare("INSERT INTO homeowner_notifications (homeowner_id, contractor_id, type, title, message, status) VALUES (:hid, :cid, 'acknowledgment', :title, :msg, 'unread')");
            $notifStmt->bindValue(':hid', $homeownerId, PDO::PARAM_INT);
            $notifStmt->bindValue(':cid', $contractorId, PDO::PARAM_INT);
            $notifStmt->bindValue(':title', $title);
            $notifStmt->bindValue(':msg', $message);
            $notifStmt->execute();
        } catch (Throwable $e) {
            // Notification creation failed, but acknowledgment succeeded
            error_log("Failed to create homeowner notification: " . $e->getMessage());
        }
    }

    echo json_encode(['success' => true, 'acknowledged_at' => date('Y-m-d H:i:s')]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error acknowledging item: ' . $e->getMessage()]);
}















