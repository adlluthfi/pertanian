<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';
require_once '../../middleware/csrf.php';
require_once '../../middleware/rateLimiting.php';
require_once '../../utils/security.php';

// Verify CSRF token for POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verifyCsrfToken();
}

try {
    $database = new Database();
    $db = $database->getKoneksi();

    // Get POST data
    $data = json_decode(file_get_contents("php://input"));
    
    // Sanitize inputs
    $username = Security::sanitizeInput($data->username ?? '');
    $password = $data->password ?? '';

    if (empty($username) || empty($password)) {
        throw new Exception("Username dan password harus diisi");
    }

    // Apply rate limiting based on username and IP
    $identifier = $username . '_' . $_SERVER['REMOTE_ADDR'];
    checkRateLimit($identifier, 5, 15); // 5 attempts per 15 minutes

    // Check user
    $stmt = $db->prepare("SELECT id, username, password FROM users WHERE username = ?");
    $stmt->execute([$username]);
    
    if ($stmt->rowCount() === 0) {
        throw new Exception("Username atau password salah");
    }

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verify password
    if (!password_verify($password, $user['password'])) {
        throw new Exception("Username atau password salah");
    }

    // Generate token
    $token = bin2hex(random_bytes(32));
    
    // Update user with new token
    $updateStmt = $db->prepare("UPDATE users SET token = ? WHERE id = ?");
    $updateStmt->execute([$token, $user['id']]);

    // Remove password and add token to response
    unset($user['password']);
    $user['token'] = $token;
    
    echo json_encode([
        'status' => 'success',
        'user' => $user
    ]);

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>