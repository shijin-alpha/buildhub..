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

    $sql = "UPDATE contractor_layout_sends SET acknowledged_at = NOW(), due_date = :due WHERE id = :id AND contractor_id = :cid";
    $stmt = $db->prepare($sql);
    $stmt->bindValue(':due', $dueDate ?: null, $dueDate ? PDO::PARAM_STR : PDO::PARAM_NULL);
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->bindValue(':cid', $contractorId, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error acknowledging item: ' . $e->getMessage()]);
}










