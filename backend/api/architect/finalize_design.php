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
    $architect_id = $_SESSION['user_id'] ?? null;
    if (!$architect_id) {
        echo json_encode(['success' => false, 'message' => 'Architect not authenticated']);
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $design_id = $input['design_id'] ?? null;

    if (!$design_id) {
        echo json_encode(['success' => false, 'message' => 'design_id is required']);
        exit;
    }

    // Ensure status column supports 'finalized'
    try { $db->exec("ALTER TABLE designs MODIFY COLUMN status ENUM('proposed','shortlisted','finalized') DEFAULT 'proposed'"); } catch (Exception $e) {}

    // Verify ownership
    $chk = $db->prepare('SELECT id, architect_id, status FROM designs WHERE id = :id LIMIT 1');
    $chk->execute([':id' => $design_id]);
    $row = $chk->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        echo json_encode(['success' => false, 'message' => 'Design not found']);
        exit;
    }
    if ((int)$row['architect_id'] !== (int)$architect_id) {
        echo json_encode(['success' => false, 'message' => 'Not authorized to finalize this design']);
        exit;
    }
    if ($row['status'] === 'finalized') {
        echo json_encode(['success' => true, 'message' => 'Already finalized']);
        exit;
    }

    $upd = $db->prepare("UPDATE designs SET status = 'finalized', updated_at = NOW() WHERE id = :id");
    $ok = $upd->execute([':id' => $design_id]);

    if ($ok) {
        echo json_encode(['success' => true, 'message' => 'Design finalized']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to finalize design']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}