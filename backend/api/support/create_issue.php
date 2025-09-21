<?php
header('Content-Type: application/json');
// CORS with credentials support
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
    $user_id = $_SESSION['user_id'] ?? null;
    $role = $_SESSION['role'] ?? null;

    if (!$user_id) {
        echo json_encode(['success' => false, 'message' => 'User not authenticated']);
        exit;
    }

    // Parse JSON body if present; fallback to form fields
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true);
    if (!is_array($input)) { $input = []; }
    $subject = trim(($input['subject'] ?? ($_POST['subject'] ?? '')));
    $category = trim(($input['category'] ?? ($_POST['category'] ?? 'general')));
    $message = trim(($input['message'] ?? ($_POST['message'] ?? '')));

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['success' => false, 'message' => 'Use POST with subject and message']);
        exit;
    }

    if ($subject === '' || $message === '') {
        echo json_encode(['success' => false, 'message' => 'Subject and message are required']);
        exit;
    }

    // Ensure support tables exist
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
        sender VARCHAR(16) NOT NULL, -- 'admin' or 'user'
        user_id INT NULL,            -- filled when sender='user'
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX(issue_id),
        CONSTRAINT fk_support_replies_issue FOREIGN KEY (issue_id) REFERENCES support_issues(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Create issue
    $stmt = $db->prepare('INSERT INTO support_issues (user_id, role, subject, category, message) VALUES (:uid, :role, :subj, :cat, :msg)');
    $stmt->bindParam(':uid', $user_id, PDO::PARAM_INT);
    $stmt->bindParam(':role', $role);
    $stmt->bindParam(':subj', $subject);
    $stmt->bindParam(':cat', $category);
    $stmt->bindParam(':msg', $message);
    $stmt->execute();

    $issue_id = (int)$db->lastInsertId();

    echo json_encode(['success' => true, 'issue_id' => $issue_id]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error creating issue: ' . $e->getMessage()]);
}


