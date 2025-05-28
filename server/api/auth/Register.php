<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../utils/security.php';

try {
    $database = new Database();
    $db = $database->getKoneksi();

    $data = json_decode(file_get_contents("php://input"));

    // Sanitize inputs
    $username = Security::sanitizeInput($data->username ?? '');
    $email = Security::sanitizeInput($data->email ?? '');
    $password = $data->password ?? '';

    // Validate input
    if (empty($username) || empty($email) || empty($password)) {
        throw new Exception("Semua field harus diisi");
    }

    if (!Security::validateEmail($email)) {
        throw new Exception("Format email tidak valid");
    }

    // Check if user exists using prepared statement
    $stmt = $db->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
    $stmt->execute([$username, $email]);
    
    if ($stmt->rowCount() > 0) {
        throw new Exception("Username atau email sudah terdaftar");
    }

    // Create new user with prepared statement
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $db->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    
    if ($stmt->execute([$username, $email, $hashedPassword])) {
        echo json_encode([
            "status" => "success",
            "message" => "Registrasi berhasil"
        ]);
    } else {
        throw new Exception("Gagal menyimpan data");
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>