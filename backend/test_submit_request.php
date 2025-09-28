<?php
// Test script to submit a request with detailed data
$testData = [
    'plot_size' => '2500',
    'budget_range' => '50-75 Lakhs',
    'requirements' => 'Test requirements',
    'location' => 'Test City',
    'timeline' => '6-12 months',
    'selected_layout_id' => null,
    'layout_type' => 'custom',
    'plot_shape' => 'Rectangular',
    'topography' => 'Flat',
    'development_laws' => 'Standard setbacks',
    'family_needs' => 'Elder-friendly, Work-from-home',
    'rooms' => '3 BHK',
    'aesthetic' => 'Modern',
    'floor_rooms' => '{"floor1":{"bedrooms":2,"bathrooms":1}}',
    'orientation' => 'North-facing',
    'site_considerations' => 'Good sunlight, privacy needed',
    'material_preferences' => 'Eco-friendly, Low maintenance',
    'budget_allocation' => '40% structure, 30% finishes, 30% services',
    'num_floors' => '2',
    'preferred_style' => 'Contemporary',
    'reference_images' => [],
    'site_images' => [],
    'room_images' => []
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost/buildhub/backend/api/homeowner/submit_request.php');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($testData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_COOKIE, 'PHPSESSID=test'); // You may need to adjust this

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo "Response: $response\n";
?>


