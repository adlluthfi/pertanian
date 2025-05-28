<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';

$database = new Database();
$db = $database->getKoneksi();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : 0;
        
        $sql = "SELECT COUNT(*) as count FROM cart WHERE user_id = :user_id";
        $stmt = $db->prepare($sql);
        $stmt->execute([':user_id' => $user_id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            'status' => 'success',
            'count' => (int)$result['count']
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