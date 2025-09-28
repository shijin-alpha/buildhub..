<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { 
    http_response_code(200); 
    exit; 
}

require_once '../../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get architect ID from session
    session_start();
    $architect_id = $_SESSION['user_id'] ?? null;
    
    if (!$architect_id) {
        echo json_encode([
            'success' => false,
            'message' => 'User not authenticated'
        ]);
        exit;
    }
    
    // Verify user is an architect
    $user_check = $db->prepare("SELECT role FROM users WHERE id = :id AND role = 'architect'");
    $user_check->execute([':id' => $architect_id]);
    $user = $user_check->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        echo json_encode([
            'success' => false,
            'message' => 'Access denied. Architect role required.'
        ]);
        exit;
    }
    
    // Get all layout requests with detailed information
    $query = "SELECT 
        lr.id,
        lr.user_id,
        lr.homeowner_id,
        lr.plot_size,
        lr.budget_range,
        lr.location,
        lr.timeline,
        lr.num_floors,
        lr.preferred_style,
        lr.orientation,
        lr.site_considerations,
        lr.material_preferences,
        lr.budget_allocation,
        lr.site_images,
        lr.reference_images,
        lr.room_images,
        lr.floor_rooms,
        lr.requirements,
        lr.status,
        lr.layout_type,
        lr.selected_layout_id,
        lr.layout_file,
        lr.created_at,
        lr.updated_at,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.address,
        u.city,
        u.state,
        u.zip_code
    FROM layout_requests lr
    JOIN users u ON lr.homeowner_id = u.id
    WHERE lr.status IN ('pending', 'approved', 'active')
    ORDER BY lr.created_at DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Process each request to parse JSON fields and add additional details
    foreach ($requests as &$request) {
        // Parse JSON fields
        $request['site_images'] = $request['site_images'] ? json_decode($request['site_images'], true) : [];
        $request['reference_images'] = $request['reference_images'] ? json_decode($request['reference_images'], true) : [];
        $request['room_images'] = $request['room_images'] ? json_decode($request['room_images'], true) : [];
        $request['floor_rooms'] = $request['floor_rooms'] ? json_decode($request['floor_rooms'], true) : [];
        $request['requirements'] = $request['requirements'] ? json_decode($request['requirements'], true) : [];
        
        // Add homeowner full name
        $request['homeowner_name'] = trim($request['first_name'] . ' ' . $request['last_name']);
        
        // Add formatted address
        $address_parts = array_filter([
            $request['address'],
            $request['city'],
            $request['state'],
            $request['zip_code']
        ]);
        $request['full_address'] = implode(', ', $address_parts);
        
        // Add request age
        $request['age_days'] = floor((time() - strtotime($request['created_at'])) / 86400);
        
        // Add priority based on status and age
        $request['priority'] = 'normal';
        if ($request['status'] === 'active') {
            $request['priority'] = 'high';
        } elseif ($request['age_days'] > 7) {
            $request['priority'] = 'urgent';
        }
    }
    
    echo json_encode([
        'success' => true,
        'requests' => $requests,
        'total' => count($requests)
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching requests: ' . $e->getMessage()
    ]);
}
?>


