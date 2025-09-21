<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
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

  // Ensure reviews table exists (for fresh DBs)
  $db->exec("CREATE TABLE IF NOT EXISTS architect_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    architect_id INT NOT NULL,
    homeowner_id INT NOT NULL,
    design_id INT NULL,
    rating TINYINT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )");

  $stmt = $db->prepare("SELECT id, first_name, last_name, email, phone, city, specialization, experience_years FROM users WHERE id = :id AND role = 'architect' LIMIT 1");
  $stmt->bindValue(':id', $uid, PDO::PARAM_INT);
  $stmt->execute();
  $user = $stmt->fetch(PDO::FETCH_ASSOC);
  if (!$user) { echo json_encode(['success' => false, 'message' => 'Profile not found']); exit; }

  // Ratings
  $r = $db->prepare("SELECT ROUND(AVG(rating),2) AS avg_rating, COUNT(*) AS review_count FROM architect_reviews WHERE architect_id = :id");
  $r->bindValue(':id', $uid, PDO::PARAM_INT);
  $r->execute();
  $rev = $r->fetch(PDO::FETCH_ASSOC) ?: ['avg_rating' => null, 'review_count' => 0];

  echo json_encode([
    'success' => true,
    'profile' => [
      'id' => (int)$user['id'],
      'first_name' => $user['first_name'],
      'last_name' => $user['last_name'],
      'email' => $user['email'],
      'phone' => $user['phone'],
      'city' => $user['city'],
      'specialization' => $user['specialization'],
      'experience_years' => is_null($user['experience_years']) ? null : (int)$user['experience_years'],
      'avg_rating' => is_null($rev['avg_rating']) ? null : (float)$rev['avg_rating'],
      'review_count' => (int)$rev['review_count'],
    ]
  ]);
} catch (Exception $e) {
  echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}