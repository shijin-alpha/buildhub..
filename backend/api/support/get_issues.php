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
header('Access-Control-Allow-Methods: GET, OPTIONS');
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

    $issue_id = isset($_GET['issue_id']) ? (int)$_GET['issue_id'] : null;

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

    if ($issue_id) {
        // Single issue with replies
        $stmt = $db->prepare('SELECT * FROM support_issues WHERE id = :id AND user_id = :uid');
        $stmt->bindParam(':id', $issue_id, PDO::PARAM_INT);
        $stmt->bindParam(':uid', $user_id, PDO::PARAM_INT);
        $stmt->execute();
        $issue = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$issue) {
            echo json_encode(['success' => false, 'message' => 'Issue not found']);
            exit;
        }
        $r = $db->prepare('SELECT id, issue_id, sender, user_id, message, created_at FROM support_replies WHERE issue_id = :iid ORDER BY created_at ASC');
        $r->bindParam(':iid', $issue_id, PDO::PARAM_INT);
        $r->execute();
        $replies = $r->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'issue' => $issue, 'replies' => $replies]);
        exit;
    }

    // List issues for the current user
    $stmt = $db->prepare('SELECT id, subject, category, status, message, created_at FROM support_issues WHERE user_id = :uid ORDER BY created_at DESC');
    $stmt->bindParam(':uid', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $issues = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'issues' => $issues]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error fetching issues: ' . $e->getMessage()]);
}


