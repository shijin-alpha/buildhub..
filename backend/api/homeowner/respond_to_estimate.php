<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');

require_once __DIR__ . '/../../config/database.php';

try {
    $input = json_decode(file_get_contents('php://input'), true) ?: [];
    $homeownerId = isset($input['homeowner_id']) ? (int)$input['homeowner_id'] : 0;
    $estimateId = isset($input['estimate_id']) ? (int)$input['estimate_id'] : 0;
    $action = isset($input['action']) ? trim(strtolower($input['action'])) : '';
    $message = isset($input['message']) ? trim($input['message']) : '';

    if ($homeownerId <= 0 || $estimateId <= 0 || !in_array($action, ['accept','changes','reject'], true)) {
        echo json_encode(['success' => false, 'message' => 'Invalid input']);
        exit;
    }

    $database = new Database();
    $db = $database->getConnection();

    // Ensure required columns exist
    $db->exec("CREATE TABLE IF NOT EXISTS contractor_send_estimates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        send_id INT NOT NULL,
        contractor_id INT NOT NULL,
        materials TEXT NULL,
        cost_breakdown TEXT NULL,
        total_cost DECIMAL(15,2) NULL,
        timeline VARCHAR(255) NULL,
        notes TEXT NULL,
        structured LONGTEXT NULL,
        status VARCHAR(32) DEFAULT 'submitted',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX(send_id), INDEX(contractor_id)
    )");
    try { $db->exec("ALTER TABLE contractor_send_estimates ADD COLUMN homeowner_feedback TEXT NULL"); } catch (Throwable $e) {}
    try { $db->exec("ALTER TABLE contractor_send_estimates ADD COLUMN homeowner_action_at DATETIME NULL"); } catch (Throwable $e) {}

    // Validate ownership: estimate -> send -> homeowner
    $q = $db->prepare("SELECT e.id FROM contractor_send_estimates e INNER JOIN contractor_layout_sends s ON s.id = e.send_id WHERE e.id = :eid AND s.homeowner_id = :hid");
    $q->bindValue(':eid', $estimateId, PDO::PARAM_INT);
    $q->bindValue(':hid', $homeownerId, PDO::PARAM_INT);
    $q->execute();
    $row = $q->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        echo json_encode(['success' => false, 'message' => 'Estimate not found for this homeowner']);
        exit;
    }

    $newStatus = $action === 'accept' ? 'accepted' : ($action === 'changes' ? 'changes_requested' : 'rejected');
    $upd = $db->prepare("UPDATE contractor_send_estimates SET status = :st, homeowner_feedback = :fb, homeowner_action_at = NOW() WHERE id = :eid");
    $upd->bindValue(':st', $newStatus, PDO::PARAM_STR);
    $upd->bindValue(':fb', $message !== '' ? $message : null, $message !== '' ? PDO::PARAM_STR : PDO::PARAM_NULL);
    $upd->bindValue(':eid', $estimateId, PDO::PARAM_INT);
    $upd->execute();

    echo json_encode(['success' => true]);
} catch (Throwable $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}




