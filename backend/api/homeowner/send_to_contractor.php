<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get POST data
    $data = json_decode(file_get_contents('php://input'), true);
    
    $layout_id = $data['layout_id'] ?? null;
    $contractor_id = $data['contractor_id'] ?? null;
    $homeowner_id = $data['homeowner_id'] ?? null;
    
    // Validate required fields
    if (!$layout_id || !$contractor_id || !$homeowner_id) {
        echo json_encode([
            'success' => false,
            'message' => 'Layout ID, Contractor ID, and Homeowner ID are required'
        ]);
        exit;
    }
    
    // Get layout details from library
    $layoutQuery = "SELECT * FROM layout_library WHERE id = :layout_id";
    $layoutStmt = $db->prepare($layoutQuery);
    $layoutStmt->execute([':layout_id' => $layout_id]);
    $layout = $layoutStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$layout) {
        echo json_encode([
            'success' => false,
            'message' => 'Layout not found'
        ]);
        exit;
    }
    
    // Check if contractor exists and is verified
    $contractorQuery = "SELECT id, first_name, last_name, email FROM users WHERE id = :contractor_id AND role = 'contractor' AND is_verified = 1";
    $contractorStmt = $db->prepare($contractorQuery);
    $contractorStmt->execute([':contractor_id' => $contractor_id]);
    $contractor = $contractorStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$contractor) {
        echo json_encode([
            'success' => false,
            'message' => 'Contractor not found or not verified'
        ]);
        exit;
    }
    
    // Create a new layout request for this specific contractor
    $insertQuery = "INSERT INTO layout_requests (
        user_id,
        homeowner_id, 
        plot_size, 
        budget_range, 
        requirements, 
        location, 
        timeline, 
        status, 
        layout_type, 
        selected_layout_id,
        layout_file,
        created_at
    ) VALUES (
        :user_id,
        :homeowner_id,
        :plot_size,
        :budget_range,
        :requirements,
        :location,
        :timeline,
        'active',
        'library',
        :layout_id,
        :layout_file,
        NOW()
    )";
    
    $insertStmt = $db->prepare($insertQuery);
    $result = $insertStmt->execute([
        ':user_id' => $homeowner_id,
        ':homeowner_id' => $homeowner_id,
        ':plot_size' => $layout['plot_size'] ?? '',
        ':budget_range' => $layout['budget_range'] ?? '',
        ':requirements' => $layout['description'] ?? '',
        ':location' => '',
        ':timeline' => 'contractor-direct',
        ':layout_id' => $layout_id,
        ':layout_file' => $layout['design_file_url'] ?? null
    ]);
    
    if ($result) {
        $requestId = $db->lastInsertId();
        
        // Create contractor assignment if table exists
        try {
            $assignmentQuery = "INSERT INTO contractor_assignments (
                layout_request_id,
                contractor_id,
                status,
                assigned_at
            ) VALUES (
                :request_id,
                :contractor_id,
                'assigned',
                NOW()
            )";
            
            $assignmentStmt = $db->prepare($assignmentQuery);
            $assignmentStmt->execute([
                ':request_id' => $requestId,
                ':contractor_id' => $contractor_id
            ]);
        } catch (Exception $e) {
            // If contractor_assignments table doesn't exist, continue without it
            // The layout request is still created successfully
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Layout sent to contractor successfully',
            'request_id' => $requestId,
            'contractor_name' => $contractor['first_name'] . ' ' . $contractor['last_name']
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to create layout request'
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error sending to contractor: ' . $e->getMessage()
    ]);
}
?>
