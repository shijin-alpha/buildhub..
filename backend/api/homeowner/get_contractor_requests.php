<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get homeowner ID from session
    session_start();
    $homeowner_id = $_SESSION['user_id'] ?? null;
    
    if (!$homeowner_id) {
        echo json_encode([
            'success' => false,
            'message' => 'User not authenticated'
        ]);
        exit;
    }
    
    // Get all layout requests sent to contractors by this homeowner
    $query = "SELECT 
                lr.id,
                lr.plot_size,
                lr.budget_range,
                lr.requirements,
                lr.location,
                lr.timeline,
                lr.status,
                lr.layout_type,
                lr.selected_layout_id,
                lr.created_at,
                lr.updated_at,
                ll.title as selected_layout_title,
                ll.image_url as selected_layout_image,
                COUNT(DISTINCT cp.id) as proposal_count,
                COUNT(DISTINCT ca.id) as assignment_count,
                GROUP_CONCAT(DISTINCT CONCAT(u.first_name, ' ', u.last_name) SEPARATOR ', ') as assigned_contractors,
                GROUP_CONCAT(DISTINCT ca.status SEPARATOR ', ') as assignment_statuses
              FROM layout_requests lr 
              LEFT JOIN layout_library ll ON lr.selected_layout_id = ll.id
              LEFT JOIN contractor_assignments ca ON lr.id = ca.layout_request_id
              LEFT JOIN users u ON ca.contractor_id = u.id
              LEFT JOIN contractor_proposals cp ON lr.id = cp.layout_request_id
              WHERE lr.homeowner_id = :homeowner_id 
                AND (lr.status = 'active' OR lr.timeline = 'contractor-direct')
                AND (lr.timeline IS NULL OR lr.timeline <> 'architect-only')
              GROUP BY lr.id
              ORDER BY lr.created_at DESC";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':homeowner_id', $homeowner_id);
    $stmt->execute();
    
    $requests = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $requests[] = [
            'id' => $row['id'],
            'plot_size' => $row['plot_size'],
            'budget_range' => $row['budget_range'],
            'requirements' => $row['requirements'],
            'location' => $row['location'],
            'timeline' => $row['timeline'],
            'status' => $row['status'] ?? 'active',
            'layout_type' => $row['layout_type'],
            'selected_layout_id' => $row['selected_layout_id'],
            'selected_layout_title' => $row['selected_layout_title'],
            'selected_layout_image' => $row['selected_layout_image'],
            'proposal_count' => (int)$row['proposal_count'],
            'assignment_count' => (int)$row['assignment_count'],
            'assigned_contractors' => $row['assigned_contractors'] ? explode(', ', $row['assigned_contractors']) : [],
            'assignment_statuses' => $row['assignment_statuses'] ? explode(', ', $row['assignment_statuses']) : [],
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'requests' => $requests
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching contractor requests: ' . $e->getMessage()
    ]);
}
?>
