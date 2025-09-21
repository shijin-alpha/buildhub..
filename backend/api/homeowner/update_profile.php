<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

session_start();

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) { echo json_encode(['success' => false, 'message' => 'Invalid JSON']); exit; }

$user_id = (int)($input['user_id'] ?? 0);
$first_name = trim($input['first_name'] ?? '');
$last_name = trim($input['last_name'] ?? '');
$phone = trim($input['phone'] ?? '');
$location = trim($input['location'] ?? '');

if (empty($_SESSION['user_id']) || $_SESSION['role'] !== 'homeowner' || $_SESSION['user_id'] !== $user_id) {
  echo json_encode(['success' => false, 'message' => 'Unauthorized']);
  exit;
}

require_once '../../config/database.php';

try {
  $database = new Database();
  $db = $database->getConnection();

  $stmt = $db->prepare("UPDATE users SET first_name = :first_name, last_name = :last_name, phone = :phone, location = :location WHERE id = :id AND role = 'homeowner'");
  $stmt->bindValue(':first_name', $first_name);
  $stmt->bindValue(':last_name', $last_name);
  $stmt->bindValue(':phone', $phone);
  $stmt->bindValue(':location', $location);
  $stmt->bindValue(':id', $user_id, PDO::PARAM_INT);
  $stmt->execute();

  // Fetch updated row
  $get = $db->prepare("SELECT id, first_name, last_name, email, phone, location FROM users WHERE id = :id LIMIT 1");
  $get->bindValue(':id', $user_id, PDO::PARAM_INT);
  $get->execute();
  $user = $get->fetch(PDO::FETCH_ASSOC);

  echo json_encode(array_merge(['success' => true], $user, ['avatar_url' => null]));
} catch (Exception $e) {
  echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
