<?php
header('Content-Type: application/json');
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if ($origin) { header('Access-Control-Allow-Origin: ' . $origin); header('Vary: Origin'); } else { header('Access-Control-Allow-Origin: http://localhost'); }
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); header('Access-Control-Max-Age: 86400'); exit; }

require_once '../../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Expect contractor_id via session on server in real deployment; keep simple: accept query
    $contractorId = isset($_GET['contractor_id']) ? (int)$_GET['contractor_id'] : 0;
    if ($contractorId <= 0) {
        echo json_encode(['success' => false, 'message' => 'Missing contractor_id']);
        exit;
    }

    // Ensure table exists (first send will create it too)
    try {
        $db->exec("CREATE TABLE IF NOT EXISTS contractor_layout_sends (
            id INT AUTO_INCREMENT PRIMARY KEY,
            contractor_id INT NOT NULL,
            homeowner_id INT NULL,
            layout_id INT NULL,
            design_id INT NULL,
            message TEXT NULL,
            payload JSON NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");
    } catch (Throwable $e) {
        $db->exec("CREATE TABLE IF NOT EXISTS contractor_layout_sends (
            id INT AUTO_INCREMENT PRIMARY KEY,
            contractor_id INT NOT NULL,
            homeowner_id INT NULL,
            layout_id INT NULL,
            design_id INT NULL,
            message TEXT NULL,
            payload LONGTEXT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");
    }
    // Ensure columns exist
    try {
        $cols = $db->query("SHOW COLUMNS FROM contractor_layout_sends")->fetchAll(PDO::FETCH_COLUMN, 0);
        if ($cols && !in_array('homeowner_id', $cols)) {
            $db->exec("ALTER TABLE contractor_layout_sends ADD COLUMN homeowner_id INT NULL AFTER contractor_id");
        }
        if ($cols && !in_array('payload', $cols)) {
            try { $db->exec("ALTER TABLE contractor_layout_sends ADD COLUMN payload JSON NULL AFTER message"); }
            catch (Throwable $e) { $db->exec("ALTER TABLE contractor_layout_sends ADD COLUMN payload LONGTEXT NULL AFTER message"); }
        }
    } catch (Throwable $e) {}

    $stmt = $db->prepare("SELECT s.*, 
        CONCAT(COALESCE(u.first_name,''), ' ', COALESCE(u.last_name,'')) AS homeowner_name,
        u.email AS homeowner_email
        FROM contractor_layout_sends s
        LEFT JOIN users u ON u.id = s.homeowner_id
        WHERE s.contractor_id = :cid
        ORDER BY s.id DESC");
    $stmt->bindValue(':cid', $contractorId, PDO::PARAM_INT);
    $stmt->execute();

    $items = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $payload = [];
        if (!empty($row['payload'])) {
            $decoded = json_decode($row['payload'], true);
            if (is_array($decoded)) $payload = $decoded;
        }
        $items[] = [
            'id' => (int)$row['id'],
            'contractor_id' => (int)$row['contractor_id'],
            'homeowner_id' => is_null($row['homeowner_id']) ? null : (int)$row['homeowner_id'],
            'homeowner_name' => $row['homeowner_name'] ?? null,
            'homeowner_email' => $row['homeowner_email'] ?? null,
            'layout_id' => is_null($row['layout_id']) ? null : (int)$row['layout_id'],
            'design_id' => is_null($row['design_id']) ? null : (int)$row['design_id'],
            'message' => $row['message'],
            'payload' => $payload,
            'created_at' => $row['created_at'],
            'acknowledged_at' => $row['acknowledged_at'] ?? null,
            'due_date' => $row['due_date'] ?? null
        ];
    }

    echo json_encode(['success' => true, 'items' => $items]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error fetching inbox: ' . $e->getMessage()]);
}



