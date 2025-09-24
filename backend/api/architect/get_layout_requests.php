<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get all approved layout requests, including assignment counters for sidebar badges
    $query = "SELECT lr.*, u.first_name, u.last_name, u.email,
                     CONCAT(u.first_name, ' ', u.last_name) as homeowner_name,
                     COUNT(DISTINCT d.id) as design_count,
                     COALESCE(SUM(CASE WHEN a.status = 'accepted' THEN 1 ELSE 0 END), 0) as accepted_count,
                     COALESCE(SUM(CASE WHEN a.status = 'declined' THEN 1 ELSE 0 END), 0) as rejected_count,
                     COALESCE(SUM(CASE WHEN a.status = 'sent' THEN 1 ELSE 0 END), 0) as sent_count
              FROM layout_requests lr 
              JOIN users u ON lr.user_id = u.id 
              LEFT JOIN designs d ON lr.id = d.layout_request_id
              LEFT JOIN layout_request_assignments a ON a.layout_request_id = lr.id
              WHERE lr.status = 'approved'
              GROUP BY lr.id
              ORDER BY lr.created_at DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $requests = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $requests[] = [
            'id' => $row['id'],
            'homeowner_name' => $row['homeowner_name'],
            'plot_size' => $row['plot_size'],
            'budget_range' => $row['budget_range'],
            'requirements' => $row['requirements'],
            // decode structured requirements if JSON
            'requirements_parsed' => json_decode($row['requirements'], true),
            'plot_shape' => $row['plot_shape'],
            'topography' => $row['topography'],
            'development_laws' => $row['development_laws'],
            'family_needs' => $row['family_needs'],
            'rooms' => $row['rooms'],
            'aesthetic' => $row['aesthetic'],
            'location' => $row['location'] ?? 'Not specified',
            'layout_file' => $row['layout_file'],
            'created_at' => $row['created_at'],
            'design_count' => (int)$row['design_count'],
            'status' => $row['status'],
            'accepted_count' => isset($row['accepted_count']) ? (int)$row['accepted_count'] : 0,
            'rejected_count' => isset($row['rejected_count']) ? (int)$row['rejected_count'] : 0,
            'sent_count' => isset($row['sent_count']) ? (int)$row['sent_count'] : 0,
        ];
    }
    
    echo json_encode([
        'success' => true,
        'requests' => $requests
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching layout requests: ' . $e->getMessage()
    ]);
}
?>