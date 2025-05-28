<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';

$database = new Database();
$db = $database->getKoneksi();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!$data || !isset($data->user_id) || !isset($data->message)) {
            throw new Exception('Invalid message data');
        }

        $sql = "INSERT INTO messages (user_id, message, is_admin) 
                VALUES (:user_id, :message, false)";
                
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':user_id' => $data->user_id,
            ':message' => $data->message
        ]);
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Message sent successfully'
        ]);

    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage()
        ]);
    }
}
?>