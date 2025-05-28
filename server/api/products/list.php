<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';
require_once '../../utils/security.php';

try {
    $database = new Database();
    $db = $database->getKoneksi();

    // Sanitize and validate query parameters
    $category_id = isset($_GET['category_id']) ? 
        Security::sanitizeInput($_GET['category_id']) : null;
    
    $query = "SELECT * FROM products WHERE 1=1";
    $params = [];

    if ($category_id !== null && Security::validateInteger($category_id)) {
        $query .= " AND category_id = ?";
        $params[] = $category_id;
    }

    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'data' => $products
    ]);

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Terjadi kesalahan'
    ]);
}