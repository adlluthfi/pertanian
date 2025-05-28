<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';

// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

$database = new Database();
$db = $database->getKoneksi();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : 0;
        
        $sql = "SELECT * FROM orders WHERE user_id = :user_id ORDER BY created_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute([':user_id' => $user_id]);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'status' => 'success',
            'data' => $orders
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