<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
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
    $user_id = $_SESSION['user_id'] ?? null; // homeowner id
    if (!$user_id) {
        echo json_encode(['success' => false, 'message' => 'User not authenticated']);
        exit;
    }

    // Accept JSON or form-encoded
    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) { $input = $_POST ?? []; }

    $request_id = isset($input['layout_request_id']) ? (int)$input['layout_request_id'] : 0;
    if ($request_id <= 0) {
        echo json_encode(['success' => false, 'message' => 'layout_request_id is required']);
        exit;
    }

    // Verify ownership (use distinct placeholders to avoid HY093 with repeated named params)
    $own = $db->prepare('SELECT id FROM layout_requests WHERE id = :id AND (user_id = :uid1 OR homeowner_id = :uid2)');
    $own->bindValue(':id', $request_id, PDO::PARAM_INT);
    $own->bindValue(':uid1', $user_id, PDO::PARAM_INT);
    $own->bindValue(':uid2', $user_id, PDO::PARAM_INT);
    $own->execute();
    if (!$own->fetchColumn()) {
        echo json_encode(['success' => false, 'message' => 'Request not found for this user']);
        exit;
    }

    // Soft delete: mark request status as 'deleted'
    try { $db->exec("ALTER TABLE layout_requests MODIFY COLUMN status ENUM('pending','approved','rejected','active','accepted','declined','deleted') DEFAULT 'pending'"); } catch (Exception $__) {}

    $upd = $db->prepare("UPDATE layout_requests SET status = 'deleted' WHERE id = :id LIMIT 1");
    $upd->bindValue(':id', $request_id, PDO::PARAM_INT);
    $upd->execute();

    echo json_encode(['success' => true, 'message' => 'Request marked as deleted']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error deleting request: ' . $e->getMessage()]);
}