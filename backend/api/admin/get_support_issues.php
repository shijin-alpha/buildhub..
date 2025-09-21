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

    $database = new Database();
    $db = $database->getConnection();

    // Ensure tables exist (idempotent)
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

    // Optional filters
    $status = isset($_GET['status']) ? trim($_GET['status']) : '';
    $category = isset($_GET['category']) ? trim($_GET['category']) : '';

    $where = [];
    $params = [];
    if ($status !== '') { $where[] = 'status = :status'; $params[':status'] = $status; }
    if ($category !== '') { $where[] = 'category = :category'; $params[':category'] = $category; }
    $whereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

    $sql = "SELECT i.id, i.user_id, i.role, i.subject, i.category, i.status, i.created_at, i.message,
                   u.first_name, u.last_name, u.email
            FROM support_issues i
            LEFT JOIN users u ON u.id = i.user_id
            $whereSql
            ORDER BY i.created_at DESC";
    $stmt = $db->prepare($sql);
    foreach ($params as $k => $v) { $stmt->bindValue($k, $v); }
    $stmt->execute();
    $issues = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'issues' => $issues]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}


