<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';

$database = new Database();
$db = $database->getKoneksi();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : 0;
        
        $sql = "SELECT m.*, u.username as sender_name 
                FROM messages m
                JOIN users u ON m.user_id = u.id
                WHERE m.user_id = :user_id
                ORDER BY m.created_at ASC";
                
        $stmt = $db->prepare($sql);
        $stmt->execute([':user_id' => $user_id]);
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'status' => 'success',
            'data' => $messages
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