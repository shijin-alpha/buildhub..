<?php
header('Content-Type: application/json');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    session_start();
    $role = $_SESSION['role'] ?? null;
    if ($role !== 'admin') {
        echo json_encode(['success' => false, 'message' => 'Admin authentication required']);
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $issue_id = isset($input['issue_id']) ? (int)$input['issue_id'] : 0;
    $message = trim($input['message'] ?? '');
    if ($issue_id <= 0 || $message === '') {
        echo json_encode(['success' => false, 'message' => 'Invalid input']);
        exit;
    }

    // Ensure tables exist
    $db->exec("CREATE TABLE IF NOT EXISTS support_issues (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        role VARCHAR(32) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        category VARCHAR(64) DEFAULT 'general',
        message TEXT NOT NULL,
        status VARCHAR(32) DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    $db->exec("CREATE TABLE IF NOT EXISTS support_replies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        issue_id INT NOT NULL,
        sender VARCHAR(16) NOT NULL,
        user_id INT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX(issue_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Insert reply
    $stmt = $db->prepare('INSERT INTO support_replies (issue_id, sender, user_id, message) VALUES (:iid, "admin", NULL, :msg)');
    $stmt->bindParam(':iid', $issue_id, PDO::PARAM_INT);
    $stmt->bindParam(':msg', $message);
    $stmt->execute();

    // Optionally update status
    $db->prepare('UPDATE support_issues SET status = "answered" WHERE id = :iid')->execute([':iid' => $issue_id]);

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error posting reply: ' . $e->getMessage()]);
}


