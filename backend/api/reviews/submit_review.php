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
    $homeowner_id = $_SESSION['user_id'] ?? null;
    $role = $_SESSION['role'] ?? null;
    if (!$homeowner_id || $role !== 'homeowner') {
        echo json_encode(['success' => false, 'message' => 'Homeowner authentication required']);
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $architect_id = (int)($input['architect_id'] ?? 0);
    $design_id = isset($input['design_id']) ? (int)$input['design_id'] : null;
    $rating = (int)($input['rating'] ?? 0);
    $comment = trim($input['comment'] ?? '');

    if ($architect_id <= 0 || $rating < 1 || $rating > 5 || $comment === '') {
        echo json_encode(['success' => false, 'message' => 'Invalid input']);
        exit;
    }

    // Ensure table exists
    $db->exec("CREATE TABLE IF NOT EXISTS architect_reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        architect_id INT NOT NULL,
        homeowner_id INT NOT NULL,
        design_id INT NULL,
        rating TINYINT NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $stmt = $db->prepare('INSERT INTO architect_reviews (architect_id, homeowner_id, design_id, rating, comment) VALUES (:aid, :hid, :did, :rating, :comment)');
    $stmt->bindValue(':aid', $architect_id, PDO::PARAM_INT);
    $stmt->bindValue(':hid', $homeowner_id, PDO::PARAM_INT);
    if ($design_id) { $stmt->bindValue(':did', $design_id, PDO::PARAM_INT); } else { $stmt->bindValue(':did', null, PDO::PARAM_NULL); }
    $stmt->bindValue(':rating', $rating, PDO::PARAM_INT);
    $stmt->bindValue(':comment', $comment, PDO::PARAM_STR);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Review submitted']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to submit review']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}