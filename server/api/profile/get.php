<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';

$database = new Database();
$db = $database->getKoneksi();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : 0;
        
        $sql = "SELECT username, email, name, phone, address FROM users WHERE id = :user_id";
        $stmt = $db->prepare($sql);
        $stmt->execute([':user_id' => $user_id]);
        $profile = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            'status' => 'success',
            'data' => $profile
        ]);

    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage()
        ]);
    }
}
?>