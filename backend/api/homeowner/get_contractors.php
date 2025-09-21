<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Optional filters
    $search = $_GET['search'] ?? '';
    $specialization = $_GET['specialization'] ?? '';
    $minExp = isset($_GET['min_experience']) ? (int)$_GET['min_experience'] : null;

    // Check if contractor_reviews table exists
    $checkReviewsTable = $db->query("SHOW TABLES LIKE 'contractor_reviews'");
    $hasReviewsTable = $checkReviewsTable && $checkReviewsTable->rowCount() > 0;

    // Build query to get approved contractors - only use columns that exist
    if ($hasReviewsTable) {
        $query = "SELECT 
                    u.id, u.first_name, u.last_name, u.email, u.role, u.is_verified,
                    u.license, u.portfolio, u.created_at,
                    (SELECT ROUND(AVG(r.rating),2) FROM contractor_reviews r WHERE r.contractor_id = u.id) AS avg_rating,
                    (SELECT COUNT(*) FROM contractor_reviews r2 WHERE r2.contractor_id = u.id) AS review_count
                  FROM users u
                  WHERE u.role = 'contractor' 
                  AND u.is_verified = 1";
    } else {
        $query = "SELECT 
                    u.id, u.first_name, u.last_name, u.email, u.role, u.is_verified,
                    u.license, u.portfolio, u.created_at,
                    NULL AS avg_rating,
                    0 AS review_count
                  FROM users u
                  WHERE u.role = 'contractor' 
                  AND u.is_verified = 1";
    }

    $params = [];

    // Add search filter - only search in existing columns
    if (!empty($search)) {
        $query .= " AND (u.first_name LIKE :search OR u.last_name LIKE :search OR u.email LIKE :search)";
        $params[':search'] = "%{$search}%";
    }

    $query .= " ORDER BY u.first_name, u.last_name";

    $stmt = $db->prepare($query);
    $stmt->execute($params);
    
    $contractors = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'contractors' => $contractors
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching contractors: ' . $e->getMessage()
    ]);
}
?>
