<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';

// Configure error logging
$logPath = __DIR__ . '/../../logs/php_error.log';
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', $logPath);
error_reporting(E_ALL);

// Ensure proper response headers
header('Content-Type: application/json; charset=utf-8');

try {
    $database = new Database();
    $db = $database->getKoneksi();

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $order_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        error_log("Processing request for order ID: " . $order_id);
        
        if ($order_id <= 0) {
            throw new Exception('Invalid order ID');
        }

        // Get order details with username instead of name
        $sql = "SELECT o.*, u.username as customer_name, pd.card_number, pd.card_holder, pd.expiry_date, pd.payment_status
                FROM orders o
                JOIN users u ON o.user_id = u.id 
                LEFT JOIN payment_details pd ON o.id = pd.order_id
                WHERE o.id = :order_id";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([':order_id' => $order_id]);
        $order = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$order) {
            throw new Exception('Order not found');
        }

        // Get order items
        $sql = "SELECT oi.*, p.name as product_name, p.image
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = :order_id";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([':order_id' => $order_id]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Add items to order data
        $order['items'] = $items;
        
        echo json_encode([
            'status' => 'success',
            'data' => $order
        ]);
        
        error_log("Successfully retrieved order data for ID: " . $order_id);

    } else {
        throw new Exception('Invalid request method');
    }

} catch(PDOException $e) {
    error_log("Database Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error occurred'
    ]);
} catch(Exception $e) {
    error_log("Application Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>