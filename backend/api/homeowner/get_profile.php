<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

session_start();

// Check if user_id is provided in query parameters for admin access
$requested_user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;
$session_user_id = $_SESSION['user_id'] ?? null;
$session_role = $_SESSION['role'] ?? '';

// Determine which user ID to use
// Allow admins to view any homeowner profile
// Allow homeowners to view only their own profile
if ($session_role === 'admin') {
  $uid = $requested_user_id ?: $session_user_id;
} else {
  // For homeowners, they can only view their own profile
  if ($session_role !== 'homeowner' || empty($session_user_id) || 
      ($requested_user_id && $requested_user_id !== $session_user_id)) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
  }
  $uid = $session_user_id;
}

require_once '../../config/database.php';

// Log request for debugging
file_put_contents('../../debug_profile_requests.log', date('Y-m-d H:i:s') . " - Request from: {$_SERVER['REMOTE_ADDR']} - User ID: {$uid}\n", FILE_APPEND);

try {
  $database = new Database();
  $db = $database->getConnection();
  
  $stmt = $db->prepare("SELECT id, first_name, last_name, email, phone, location FROM users WHERE id = :id AND role = 'homeowner' LIMIT 1");
  $stmt->bindValue(':id', $uid, PDO::PARAM_INT);
  $stmt->execute();
  $user = $stmt->fetch(PDO::FETCH_ASSOC);
  
  if (!$user) { 
    echo json_encode(['success' => false, 'message' => 'Profile not found']); 
    exit; 
  }

  echo json_encode([
    'success' => true,
    'id' => (int)$user['id'],
    'first_name' => $user['first_name'],
    'last_name' => $user['last_name'],
    'email' => $user['email'],
    'phone' => $user['phone'],
    'location' => $user['location'],
    'avatar_url' => null
  ]);
} catch (Exception $e) {
  echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}