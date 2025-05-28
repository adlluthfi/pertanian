<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';

$database = new Database();
$db = $database->getKoneksi();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $sql = "SELECT t.*, 
                COALESCE(COUNT(tr.id), 0) as registered_count 
                FROM trainings t 
                LEFT JOIN training_registrations tr ON t.id = tr.training_id 
                GROUP BY t.id 
                ORDER BY t.date ASC";
                
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $trainings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'status' => 'success',
            'data' => $trainings
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