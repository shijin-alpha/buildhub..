<?php
// Disable HTML error output for clean JSON responses
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

// Headers
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$response = ['success' => false, 'stats' => [], 'message' => ''];

try {
    require_once __DIR__ . '/../../config/database.php';

    $db = (new Database())->getConnection();

    // Check if users.status column exists
    $colStmt = $db->query("SHOW COLUMNS FROM users LIKE 'status'");
    $hasStatus = $colStmt && $colStmt->rowCount() > 0;

    // Total users
    $totalUsers = 0;
    $stmt = $db->query("SELECT COUNT(*) AS c FROM users");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $totalUsers = (int)($row['c'] ?? 0);

    // Pending approvals: contractors/architects not yet approved
    if ($hasStatus) {
        $stmt = $db->prepare("SELECT COUNT(*) AS c FROM users WHERE (role = 'contractor' OR role = 'architect') AND status = 'pending'");
    } else {
        $stmt = $db->prepare("SELECT COUNT(*) AS c FROM users WHERE (role = 'contractor' OR role = 'architect') AND is_verified = 0");
    }
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $pendingApprovals = (int)($row['c'] ?? 0);

    // Materials count (0 if table missing)
    $materialsCount = 0;
    $matTbl = $db->query("SHOW TABLES LIKE 'materials'");
    if ($matTbl && $matTbl->rowCount() > 0) {
        $stmt = $db->query("SELECT COUNT(*) AS c FROM materials");
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $materialsCount = (int)($row['c'] ?? 0);
    }

    // Active projects: try known tables, else 0
    $activeProjects = 0;
    $projTbl = $db->query("SHOW TABLES LIKE 'projects'");
    if ($projTbl && $projTbl->rowCount() > 0) {
        // If projects table exists, count active ones if status column exists; else total as active
        $projStatusCol = $db->query("SHOW COLUMNS FROM projects LIKE 'status'");
        if ($projStatusCol && $projStatusCol->rowCount() > 0) {
            $stmt = $db->query("SELECT COUNT(*) AS c FROM projects WHERE status IN ('active','in_progress','ongoing')");
        } else {
            $stmt = $db->query("SELECT COUNT(*) AS c FROM projects");
        }
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $activeProjects = (int)($row['c'] ?? 0);
    } else {
        // Try layout_requests as an alternative source
        $lrTbl = $db->query("SHOW TABLES LIKE 'layout_requests'");
        if ($lrTbl && $lrTbl->rowCount() > 0) {
            $lrStatusCol = $db->query("SHOW COLUMNS FROM layout_requests LIKE 'status'");
            if ($lrStatusCol && $lrStatusCol->rowCount() > 0) {
                $stmt = $db->query("SELECT COUNT(*) AS c FROM layout_requests WHERE status IN ('assigned','in_progress','approved')");
            } else {
                $stmt = $db->query("SELECT COUNT(*) AS c FROM layout_requests");
            }
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $activeProjects = (int)($row['c'] ?? 0);
        }
    }

    $response['success'] = true;
    $response['stats'] = [
        'totalUsers' => $totalUsers,
        'pendingApprovals' => $pendingApprovals,
        'totalMaterials' => $materialsCount,
        'activeProjects' => $activeProjects
    ];
    $response['message'] = 'Stats retrieved successfully';
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = 'Error fetching stats: ' . $e->getMessage();
}

echo json_encode($response);