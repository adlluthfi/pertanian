<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';

$database = new Database();
$db = $database->getKoneksi();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : 0;
        
        $sql = "SELECT c.id, c.quantity, p.* 
                FROM cart c 
                JOIN products p ON c.product_id = p.id 
                WHERE c.user_id = :user_id";
                
        $stmt = $db->prepare($sql);
        $stmt->execute([':user_id' => $user_id]);
        $cart_items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'status' => 'success',
            'data' => $cart_items
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