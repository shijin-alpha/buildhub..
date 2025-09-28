<?php
// Test script to create a new request with detailed data
require_once 'config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Test data
    $testData = [
        'user_id' => 28, // Use existing homeowner
        'homeowner_id' => 28,
        'plot_size' => '2500',
        'budget_range' => '50-75 Lakhs',
        'requirements' => json_encode([
            'plot_shape' => 'Rectangular',
            'topography' => 'Flat',
            'development_laws' => 'Standard setbacks',
            'family_needs' => 'Elder-friendly, Work-from-home',
            'rooms' => '3 BHK',
            'aesthetic' => 'Modern',
            'notes' => 'Test requirements',
            'orientation' => 'North-facing',
            'site_considerations' => 'Good sunlight, privacy needed',
            'material_preferences' => 'Eco-friendly, Low maintenance',
            'budget_allocation' => '40% structure, 30% finishes, 30% services',
            'num_floors' => '2',
            'preferred_style' => 'Contemporary',
            'site_images' => [],
            'reference_images' => [],
            'room_images' => []
        ]),
        'location' => 'Test City',
        'timeline' => '6-12 months',
        'selected_layout_id' => null,
        'layout_type' => 'custom',
        'orientation' => 'North-facing',
        'site_considerations' => 'Good sunlight, privacy needed',
        'material_preferences' => 'Eco-friendly, Low maintenance',
        'budget_allocation' => '40% structure, 30% finishes, 30% services',
        'num_floors' => '2',
        'preferred_style' => 'Contemporary',
        'floor_rooms' => json_encode(['floor1' => ['bedrooms' => 2, 'bathrooms' => 1]]),
        'site_images' => json_encode([]),
        'reference_images' => json_encode([]),
        'room_images' => json_encode([])
    ];
    
    $query = "INSERT INTO layout_requests (
                user_id, homeowner_id, plot_size, budget_range, requirements, location, timeline, selected_layout_id, layout_type,
                orientation, site_considerations, material_preferences, budget_allocation, num_floors, preferred_style, floor_rooms,
                site_images, reference_images, room_images
              ) VALUES (
                :user_id, :homeowner_id, :plot_size, :budget_range, :requirements, :location, :timeline, :selected_layout_id, :layout_type,
                :orientation, :site_considerations, :material_preferences, :budget_allocation, :num_floors, :preferred_style, :floor_rooms,
                :site_images, :reference_images, :room_images
              )";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $testData['user_id'], PDO::PARAM_INT);
    $stmt->bindParam(':homeowner_id', $testData['homeowner_id'], PDO::PARAM_INT);
    $stmt->bindParam(':plot_size', $testData['plot_size']);
    $stmt->bindParam(':budget_range', $testData['budget_range']);
    $stmt->bindParam(':requirements', $testData['requirements']);
    $stmt->bindParam(':location', $testData['location']);
    $stmt->bindParam(':timeline', $testData['timeline']);
    $stmt->bindParam(':selected_layout_id', $testData['selected_layout_id']);
    $stmt->bindParam(':layout_type', $testData['layout_type']);
    $stmt->bindParam(':orientation', $testData['orientation']);
    $stmt->bindParam(':site_considerations', $testData['site_considerations']);
    $stmt->bindParam(':material_preferences', $testData['material_preferences']);
    $stmt->bindParam(':budget_allocation', $testData['budget_allocation']);
    $stmt->bindParam(':num_floors', $testData['num_floors']);
    $stmt->bindParam(':preferred_style', $testData['preferred_style']);
    $stmt->bindParam(':floor_rooms', $testData['floor_rooms']);
    $stmt->bindParam(':site_images', $testData['site_images']);
    $stmt->bindParam(':reference_images', $testData['reference_images']);
    $stmt->bindParam(':room_images', $testData['room_images']);
    
    if ($stmt->execute()) {
        $requestId = $db->lastInsertId();
        echo "✅ Test request created successfully with ID: $requestId\n";
        
        // Verify the data was saved correctly
        $verify = $db->prepare("SELECT * FROM layout_requests WHERE id = ?");
        $verify->execute([$requestId]);
        $request = $verify->fetch(PDO::FETCH_ASSOC);
        
        echo "\n=== Verification ===\n";
        echo "Orientation: " . ($request['orientation'] ?? 'NULL') . "\n";
        echo "Site Considerations: " . ($request['site_considerations'] ?? 'NULL') . "\n";
        echo "Material Preferences: " . ($request['material_preferences'] ?? 'NULL') . "\n";
        echo "Budget Allocation: " . ($request['budget_allocation'] ?? 'NULL') . "\n";
        echo "Number of Floors: " . ($request['num_floors'] ?? 'NULL') . "\n";
        echo "Preferred Style: " . ($request['preferred_style'] ?? 'NULL') . "\n";
        echo "Floor Rooms: " . ($request['floor_rooms'] ?? 'NULL') . "\n";
        
    } else {
        echo "❌ Failed to create test request\n";
        print_r($stmt->errorInfo());
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
