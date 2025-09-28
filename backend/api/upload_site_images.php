<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { 
    http_response_code(200); 
    exit; 
}

session_start();

if (empty($_SESSION['user_id'])) { 
    echo json_encode(['success' => false, 'message' => 'Unauthorized']); 
    exit; 
}

$userId = (int)$_SESSION['user_id'];

if (!isset($_FILES['site_images'])) { 
    echo json_encode(['success' => false, 'message' => 'No files uploaded']); 
    exit; 
}

$files = $_FILES['site_images'];
$uploadedImages = [];

// Handle multiple file uploads
$fileCount = is_array($files['name']) ? count($files['name']) : 1;

for ($i = 0; $i < $fileCount; $i++) {
    $fileName = is_array($files['name']) ? $files['name'][$i] : $files['name'];
    $fileTmpName = is_array($files['tmp_name']) ? $files['tmp_name'][$i] : $files['tmp_name'];
    $fileError = is_array($files['error']) ? $files['error'][$i] : $files['error'];
    $fileSize = is_array($files['size']) ? $files['size'][$i] : $files['size'];
    
    if ($fileError !== UPLOAD_ERR_OK) {
        continue; // Skip files with errors
    }
    
    // Validate file type
    $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/gif' => 'gif', 'image/webp' => 'webp', 'image/avif' => 'avif'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $fileTmpName);
    
    if (!isset($allowed[$mime])) {
        continue; // Skip invalid file types
    }
    
    $ext = $allowed[$mime];
    
    // Create uploads directory if it doesn't exist
    $uploadsDir = __DIR__ . '/../../uploads/site_images';
    if (!is_dir($uploadsDir)) { 
        mkdir($uploadsDir, 0777, true); 
    }
    
    // Generate unique filename
    $basename = $userId . '_' . bin2hex(random_bytes(8)) . '.' . $ext;
    $destPath = $uploadsDir . '/' . $basename;
    
    if (move_uploaded_file($fileTmpName, $destPath)) {
        // Build public URL
        $publicUrl = '/buildhub/uploads/site_images/' . $basename;
        
        $uploadedImages[] = [
            'id' => uniqid(),
            'name' => $fileName,
            'size' => $fileSize,
            'url' => $publicUrl,
            'path' => $destPath,
            'ext' => $ext
        ];
    }
}

if (empty($uploadedImages)) {
    echo json_encode(['success' => false, 'message' => 'No files were uploaded successfully']); 
    exit;
}

echo json_encode([
    'success' => true, 
    'message' => 'Files uploaded successfully',
    'images' => $uploadedImages
]);
?>


