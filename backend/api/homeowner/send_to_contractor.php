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
    $contractor_message = $data['contractor_message'] ?? '';
    $forwarded_design = $data['forwarded_design'] ?? null; // optional full design payload
    
    // Validate required fields: allow either layout_id OR forwarded_design
    if (!$contractor_id || !$homeowner_id || (!$layout_id && empty($forwarded_design))) {
        echo json_encode([
            'success' => false,
            'message' => 'Contractor and Homeowner are required, plus either a layout or forwarded design'
        ]);
        exit;
    }

    $layout = null;
    if ($layout_id) {
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
        :layout_type,
        :selected_layout_id,
        :layout_file,
        NOW()
    )";
    
    $insertStmt = $db->prepare($insertQuery);
    // Build structured requirements JSON including forwarded design details (if any)
    $requirementsPayload = [
        'source' => 'homeowner-forward',
        'contractor_message' => $contractor_message,
        'layout_description' => $layout['description'] ?? '',
        'forwarded_design' => $forwarded_design ?: null
    ];

    // Determine layout type, selected_layout_id and layout_file
    $derived_layout_type = $layout ? 'library' : 'direct';
    $derived_selected_layout_id = $layout ? $layout_id : null;
    $derived_layout_file = $layout['design_file_url'] ?? null;
    if (!$derived_layout_file && !empty($forwarded_design) && !empty($forwarded_design['files']) && is_array($forwarded_design['files'])) {
        $first = $forwarded_design['files'][0];
        if (is_array($first)) {
            $derived_layout_file = $first['path'] ?? ($first['stored'] ?? ($first['original'] ?? null));
            if ($derived_layout_file && strpos($derived_layout_file, '/buildhub/backend/uploads/designs/') === false && !preg_match('/^https?:/i', $derived_layout_file)) {
                $derived_layout_file = '/buildhub/backend/uploads/designs/' . $derived_layout_file;
            }
        }
    }

    $result = $insertStmt->execute([
        ':user_id' => $homeowner_id,
        ':homeowner_id' => $homeowner_id,
        ':plot_size' => $layout['plot_size'] ?? '',
        ':budget_range' => $layout['budget_range'] ?? '',
        ':requirements' => json_encode($requirementsPayload),
        ':location' => '',
        ':timeline' => 'contractor-direct',
        ':layout_type' => $derived_layout_type,
        ':selected_layout_id' => $derived_selected_layout_id,
        ':layout_file' => $derived_layout_file
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
