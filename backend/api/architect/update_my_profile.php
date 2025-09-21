<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

session_start();
if (empty($_SESSION['user_id']) || ($_SESSION['role'] ?? '') !== 'architect') {
  echo json_encode(['success' => false, 'message' => 'Unauthorized']);
  exit;
}

require_once '../../config/database.php';

try {
  $database = new Database();
  $db = $database->getConnection();
  $uid = (int)$_SESSION['user_id'];

  // Ensure required columns exist (handles older DBs without prior migration)
  try { $db->exec("ALTER TABLE users ADD COLUMN specialization VARCHAR(255) NULL"); } catch (Exception $e) {}
  try { $db->exec("ALTER TABLE users ADD COLUMN experience_years INT NULL"); } catch (Exception $e) {}
  try { $db->exec("ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL"); } catch (Exception $e) {}
  try { $db->exec("ALTER TABLE users ADD COLUMN city VARCHAR(100) NULL"); } catch (Exception $e) {}

  $input = json_decode(file_get_contents('php://input'), true);
  if (!is_array($input)) { echo json_encode(['success' => false, 'message' => 'Invalid payload']); exit; }

  $fields = [
    'specialization' => 'specialization',
    'experience_years' => 'experience_years',
    'phone' => 'phone',
    'city' => 'city'
  ];

  $sets = [];
  $params = [':id' => $uid];
  foreach ($fields as $in => $col) {
    if (array_key_exists($in, $input)) {
      $sets[] = "$col = :$in";
      $params[":$in"] = $in === 'experience_years' && $input[$in] !== null && $input[$in] !== ''
        ? (int)$input[$in] : ($input[$in] === '' ? null : $input[$in]);
    }
  }

  if (!$sets) { echo json_encode(['success' => false, 'message' => 'No changes provided']); exit; }

  $sql = 'UPDATE users SET ' . implode(', ', $sets) . " WHERE id = :id AND role = 'architect'";
  $stmt = $db->prepare($sql);
  foreach ($params as $k => $v) { $stmt->bindValue($k, $v); }
  $stmt->execute();

  echo json_encode(['success' => true, 'message' => 'Profile updated']);
} catch (Exception $e) {
  echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}