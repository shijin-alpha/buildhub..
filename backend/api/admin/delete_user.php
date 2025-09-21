<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $input = json_decode(file_get_contents('php://input'), true);
    if (!isset($input['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'User ID is required']);
        exit;
    }

    $userId = (int)$input['user_id'];

    // Ensure user exists
    $stmt = $db->prepare("SELECT id, first_name, last_name, email FROM users WHERE id = :id");
    $stmt->bindParam(':id', $userId, PDO::PARAM_INT);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }

    // Check if soft-delete column exists
    $colStmt = $db->query("SHOW COLUMNS FROM users LIKE 'deleted_at'");
    $hasDeletedAt = $colStmt && $colStmt->rowCount() > 0;

    $db->beginTransaction();
    try {
        if ($hasDeletedAt) {
            $delStmt = $db->prepare("UPDATE users SET deleted_at = CURRENT_TIMESTAMP, status = COALESCE(status, 'rejected') WHERE id = :id");
            $delStmt->bindParam(':id', $userId, PDO::PARAM_INT);
            $ok = $delStmt->execute();
        } else {
            // Hard delete fallback
            $delStmt = $db->prepare("DELETE FROM users WHERE id = :id");
            $delStmt->bindParam(':id', $userId, PDO::PARAM_INT);
            $ok = $delStmt->execute();
        }

        if (!$ok) {
            throw new Exception('Failed to delete user');
        }

        $db->commit();
    } catch (Exception $e) {
        $db->rollBack();
        throw $e;
    }

    // Optionally log admin action
    try {
        $db->exec("CREATE TABLE IF NOT EXISTS admin_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            action VARCHAR(100) NOT NULL,
            user_id INT NOT NULL,
            details TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )");
        $logStmt = $db->prepare("INSERT INTO admin_logs (action, user_id, details, created_at) VALUES ('delete_user', :user_id, :details, CURRENT_TIMESTAMP)");
        $logStmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $details = json_encode(['name' => $user['first_name'] . ' ' . $user['last_name'], 'email' => $user['email'], 'soft_deleted' => $hasDeletedAt]);
        $logStmt->bindParam(':details', $details);
        $logStmt->execute();
    } catch (Exception $e) {
        // ignore logging failure
    }

    echo json_encode(['success' => true, 'message' => $hasDeletedAt ? 'User deleted (soft-delete).' : 'User permanently deleted.']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error deleting user: ' . $e->getMessage()]);
}
?>


