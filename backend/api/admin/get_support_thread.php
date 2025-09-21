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
    session_start();
    $role = $_SESSION['role'] ?? null;
    if ($role !== 'admin') {
        echo json_encode(['success' => false, 'message' => 'Admin authentication required']);
        exit;
    }

    $issue_id = isset($_GET['issue_id']) ? (int)$_GET['issue_id'] : 0;
    if ($issue_id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid issue id']);
        exit;
    }

    $database = new Database();
    $db = $database->getConnection();

    $stmt = $db->prepare('SELECT i.*, u.first_name, u.last_name, u.email FROM support_issues i LEFT JOIN users u ON u.id = i.user_id WHERE i.id = :id');
    $stmt->bindParam(':id', $issue_id, PDO::PARAM_INT);
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

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}


