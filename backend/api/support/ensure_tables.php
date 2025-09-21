<?php
header('Content-Type: application/json');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin) { header('Access-Control-Allow-Origin: ' . $origin); header('Vary: Origin'); } else { header('Access-Control-Allow-Origin: *'); }
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once '../../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Create issues table
    $db->exec("CREATE TABLE IF NOT EXISTS support_issues (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        role VARCHAR(32) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        category VARCHAR(64) DEFAULT 'general',
        message TEXT NOT NULL,
        status VARCHAR(32) DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (user_id),
        INDEX (status),
        INDEX (category)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Create replies table
    $db->exec("CREATE TABLE IF NOT EXISTS support_replies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        issue_id INT NOT NULL,
        sender VARCHAR(16) NOT NULL,
        user_id INT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX(issue_id),
        CONSTRAINT fk_support_replies_issue FOREIGN KEY (issue_id) REFERENCES support_issues(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Basic table existence check
    $issuesCount = $db->query("SELECT COUNT(*) FROM support_issues")->fetchColumn();
    $repliesCount = $db->query("SELECT COUNT(*) FROM support_replies")->fetchColumn();

    echo json_encode([
        'success' => true,
        'message' => 'Support tables ensured',
        'issues_rows' => (int)$issuesCount,
        'replies_rows' => (int)$repliesCount
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error ensuring tables: ' . $e->getMessage()]);
}

























