<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

session_start();

if (empty($_SESSION['user_id'])) { echo json_encode(['success' => false, 'message' => 'Unauthorized']); exit; }

$userId = (int)($_POST['user_id'] ?? 0);
if ($userId !== (int)$_SESSION['user_id']) { echo json_encode(['success' => false, 'message' => 'Unauthorized']); exit; }

if (!isset($_FILES['avatar'])) { echo json_encode(['success' => false, 'message' => 'No file uploaded']); exit; }

$file = $_FILES['avatar'];
if ($file['error'] !== UPLOAD_ERR_OK) { echo json_encode(['success' => false, 'message' => 'Upload error']); exit; }

$allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/gif' => 'gif', 'image/webp' => 'webp'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name']);
if (!isset($allowed[$mime])) { echo json_encode(['success' => false, 'message' => 'Invalid file type']); exit; }
$ext = $allowed[$mime];

$uploadsDir = __DIR__ . '/../../uploads/avatars';
if (!is_dir($uploadsDir)) { mkdir($uploadsDir, 0777, true); }

$basename = $userId . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
$destPath = $uploadsDir . '/' . $basename;

if (!move_uploaded_file($file['tmp_name'], $destPath)) { echo json_encode(['success' => false, 'message' => 'Failed to save file']); exit; }

// Build public URL (assumes project is served from /buildhub)
$publicUrl = '/buildhub/uploads/avatars/' . $basename;

echo json_encode(['success' => true, 'avatar_url' => $publicUrl]);
