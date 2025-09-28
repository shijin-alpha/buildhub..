<?php
// Test script to check if detailed data is being saved correctly
require_once 'config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get the most recent layout request
    $query = "SELECT * FROM layout_requests ORDER BY created_at DESC LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $request = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($request) {
        echo "=== Most Recent Layout Request ===\n";
        echo "ID: " . $request['id'] . "\n";
        echo "Plot Size: " . $request['plot_size'] . "\n";
        echo "Budget: " . $request['budget_range'] . "\n";
        echo "Location: " . $request['location'] . "\n";
        echo "Timeline: " . $request['timeline'] . "\n";
        echo "Orientation: " . ($request['orientation'] ?? 'NULL') . "\n";
        echo "Site Considerations: " . ($request['site_considerations'] ?? 'NULL') . "\n";
        echo "Material Preferences: " . ($request['material_preferences'] ?? 'NULL') . "\n";
        echo "Budget Allocation: " . ($request['budget_allocation'] ?? 'NULL') . "\n";
        echo "Number of Floors: " . ($request['num_floors'] ?? 'NULL') . "\n";
        echo "Preferred Style: " . ($request['preferred_style'] ?? 'NULL') . "\n";
        echo "Floor Rooms: " . ($request['floor_rooms'] ?? 'NULL') . "\n";
        echo "Site Images: " . ($request['site_images'] ?? 'NULL') . "\n";
        echo "Reference Images: " . ($request['reference_images'] ?? 'NULL') . "\n";
        echo "Room Images: " . ($request['room_images'] ?? 'NULL') . "\n";
        
        echo "\n=== Requirements JSON ===\n";
        $requirements = json_decode($request['requirements'], true);
        if ($requirements) {
            foreach ($requirements as $key => $value) {
                if (is_array($value)) {
                    echo "$key: " . json_encode($value) . "\n";
                } else {
                    echo "$key: $value\n";
                }
            }
        }
    } else {
        echo "No layout requests found in database.\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>


