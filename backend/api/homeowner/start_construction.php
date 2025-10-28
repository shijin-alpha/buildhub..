<?php
header('Content-Type: application/json');
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if ($origin) { header('Access-Control-Allow-Origin: ' . $origin); header('Vary: Origin'); } else { header('Access-Control-Allow-Origin: http://localhost'); }
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// We accept POST as primary, but also allow GET for resiliency in dev
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    // Gather input from JSON body, POST form, or GET query
    $raw = file_get_contents('php://input');
    $json = $raw ? json_decode($raw, true) : null;
    $homeowner_id = $json['homeowner_id'] ?? ($_POST['homeowner_id'] ?? ($_GET['homeowner_id'] ?? null));
    $estimate_id = $json['estimate_id'] ?? ($_POST['estimate_id'] ?? ($_GET['estimate_id'] ?? null));
    $contractor_id = $json['contractor_id'] ?? ($_POST['contractor_id'] ?? ($_GET['contractor_id'] ?? null));
    $project_title = $json['project_title'] ?? ($_POST['project_title'] ?? ($_GET['project_title'] ?? 'Untitled Project'));
    $homeowner_message = isset($json['message']) ? trim((string)$json['message']) : (isset($_POST['message']) ? trim((string)$_POST['message']) : (isset($_GET['message']) ? trim((string)$_GET['message']) : ''));
    
    if (!$homeowner_id || !$estimate_id || !$contractor_id) {
        throw new Exception('Missing required parameters');
    }
    
    require_once '../../config/database.php';
    
    $database = new Database();
    $pdo = $database->getConnection();

    // Ensure contractor_inbox table exists and has required columns
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS contractor_inbox (
            id INT AUTO_INCREMENT PRIMARY KEY,
            contractor_id INT NOT NULL,
            homeowner_id INT NOT NULL,
            estimate_id INT DEFAULT NULL,
            type ENUM('layout_request', 'construction_start', 'estimate_response', 'general') DEFAULT 'layout_request',
            title VARCHAR(255) NOT NULL,
            message TEXT,
            status ENUM('unread', 'read', 'acknowledged') DEFAULT 'unread',
            acknowledged_at TIMESTAMP NULL DEFAULT NULL,
            due_date DATE NULL DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_contractor_id (contractor_id),
            INDEX idx_status (status),
            INDEX idx_type (type),
            INDEX idx_created_at (created_at)
        )");
    } catch (Throwable $e) {}
    
    // Start transaction
    $pdo->beginTransaction();
    
    try {
        // First, fetch the complete estimate details
        $stmt = $pdo->prepare("
            SELECT e.*, 
                   CONCAT(COALESCE(h.first_name,''), ' ', COALESCE(h.last_name,'')) AS homeowner_name,
                   h.email AS homeowner_email,
                   h.phone AS homeowner_phone
            FROM contractor_send_estimates e
            INNER JOIN contractor_layout_sends s ON s.id = e.send_id
            LEFT JOIN users h ON h.id = s.homeowner_id
            WHERE e.id = ? AND s.homeowner_id = ?
        ");
        $stmt->execute([$estimate_id, $homeowner_id]);
        $estimate = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$estimate) {
            throw new Exception('Estimate not found or access denied');
        }
        
        // Update estimate status to 'construction_started'
        $stmt = $pdo->prepare("UPDATE contractor_send_estimates SET status = 'construction_started', created_at = NOW() WHERE id = ?");
        $stmt->execute([$estimate_id]);
        
        // Build simple notification message
        $title = "Construction Approval - " . ($estimate['project_title'] ?? 'Untitled Project');
        $message = "The homeowner has approved your estimate and given permission to start construction work.";
        
        // Insert construction notification into contractor inbox
        $stmt = $pdo->prepare("
            INSERT INTO contractor_inbox (
                contractor_id, 
                homeowner_id, 
                estimate_id, 
                type, 
                title, 
                message, 
                status, 
                created_at
            ) VALUES (?, ?, ?, 'construction_start', ?, ?, 'unread', NOW())
        ");
        
        $stmt->execute([$contractor_id, $homeowner_id, $estimate_id, $title, $message]);
        
        // Commit transaction
        $pdo->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Construction started successfully. Contractor has been notified.',
            'data' => [
                'estimate_id' => $estimate_id,
                'contractor_id' => $contractor_id,
                'status' => 'construction_started'
            ]
        ]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
