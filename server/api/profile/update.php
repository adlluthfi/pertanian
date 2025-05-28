<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';
require_once '../../utils/security.php';

$database = new Database();
$db = $database->getKoneksi();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        // Sanitize inputs
        $email = Security::sanitizeInput($data->email ?? '');
        $name = Security::sanitizeInput($data->name ?? '');
        $phone = Security::sanitizeInput($data->phone ?? '');
        $address = Security::sanitizeInput($data->address ?? '');
        $user_id = Security::sanitizeInput($data->user_id ?? '');

        // Validate required fields
        if (empty($email) || empty($name) || empty($user_id)) {
            throw new Exception("Email, nama, dan user ID harus diisi");
        }

        // Validate email format
        if (!Security::validateEmail($email)) {
            throw new Exception("Format email tidak valid");
        }

        // Validate user_id is integer
        if (!Security::validateInteger($user_id)) {
            throw new Exception("User ID tidak valid");
        }

        $sql = "UPDATE users SET 
                email = :email,
                name = :name,
                phone = :phone,
                address = :address
                WHERE id = :user_id";
                
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':email' => $email,
            ':name' => $name,
            ':phone' => $phone,
            ':address' => $address,
            ':user_id' => $user_id
        ]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Profile berhasil diperbarui'
        ]);

    } catch(Exception $e) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage()
        ]);
    }
}
?>