<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';
require_once '../../utils/security.php';

header('Content-Type: application/json');

try {
    // Log raw input for debugging
    error_log("Raw input: " . file_get_contents("php://input"));
    
    $database = new Database();
    $db = $database->getKoneksi();
    
    $data = json_decode(file_get_contents("php://input"));
    
    // Check for JSON decode errors
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON: " . json_last_error_msg());
    }

    // Validate cart items structure
    if (!empty($data->cart)) {
        foreach ($data->cart as $item) {
            if (!isset($item->product_id) || !isset($item->quantity) || !isset($item->price)) {
                error_log("Invalid cart item: " . print_r($item, true));
                throw new Exception("Format data produk tidak valid");
            }
            
            // Validate product exists
            $check_stmt = $db->prepare("SELECT stock FROM products WHERE id = ?");
            $check_stmt->execute([filter_var($item->product_id, FILTER_VALIDATE_INT)]);
            $product = $check_stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$product) {
                throw new Exception("Produk dengan ID " . $item->product_id . " tidak ditemukan");
            }
        }
    }

    // Validate data structure
    if (!is_object($data)) {
        throw new Exception("Format data tidak valid");
    }

    // Validate required fields
    if (!isset($data->user_id) || !is_numeric($data->user_id)) {
        throw new Exception("ID pengguna tidak valid");
    }

    if (!isset($data->shipping_info) || 
        !isset($data->shipping_info->name) || 
        !isset($data->shipping_info->address) || 
        !isset($data->shipping_info->phone)) {
        throw new Exception("Informasi pengiriman tidak lengkap");
    }

    if (!isset($data->cart) || !is_array($data->cart) || empty($data->cart)) {
        throw new Exception("Keranjang belanja kosong");
    }

    // Sanitize inputs
    $user_id = filter_var($data->user_id, FILTER_VALIDATE_INT);
    $shipping_name = Security::sanitizeInput($data->shipping_info->name);
    $shipping_address = Security::sanitizeInput($data->shipping_info->address);
    $shipping_phone = Security::sanitizeInput($data->shipping_info->phone);
    $total_amount = filter_var($data->total ?? 0, FILTER_VALIDATE_FLOAT);

    // Validate sanitized data
    if (!$user_id || !$shipping_name || !$shipping_address || !$shipping_phone || !$total_amount) {
        throw new Exception("Data pesanan tidak valid");
    }

    $db->beginTransaction();

    try {
        // Insert order
        $stmt = $db->prepare("INSERT INTO orders (
            user_id, 
            shipping_name, 
            shipping_address, 
            shipping_phone, 
            total_amount, 
            status
        ) VALUES (?, ?, ?, ?, ?, 'pending')");
        
        $stmt->execute([
            $user_id,
            $shipping_name,
            $shipping_address,
            $shipping_phone,
            $total_amount
        ]);
        
        $order_id = $db->lastInsertId();

        // Process cart items
        foreach ($data->cart as $item) {
            // Validate item data
            if (!isset($item->product_id) || !isset($item->quantity) || !isset($item->price)) {
                throw new Exception("Data produk tidak lengkap");
            }

            $product_id = filter_var($item->product_id, FILTER_VALIDATE_INT);
            $quantity = filter_var($item->quantity, FILTER_VALIDATE_INT);
            $price = filter_var($item->price, FILTER_VALIDATE_FLOAT);

            if (!$product_id || !$quantity || $quantity <= 0 || !$price) {
                throw new Exception("Data produk tidak valid");
            }

            // Check stock availability
            $stock_stmt = $db->prepare("SELECT stock FROM products WHERE id = ?");
            $stock_stmt->execute([$product_id]);
            $product = $stock_stmt->fetch(PDO::FETCH_ASSOC);

            if (!$product) {
                throw new Exception("Produk tidak ditemukan");
            }

            if ($product['stock'] < $quantity) {
                throw new Exception("Stok produk tidak mencukupi untuk produk ID: " . $product_id);
            }

            // Insert order item
            $item_stmt = $db->prepare("INSERT INTO order_items (
                order_id, 
                product_id, 
                quantity, 
                price
            ) VALUES (?, ?, ?, ?)");
            
            $item_stmt->execute([$order_id, $product_id, $quantity, $price]);

            // Update product stock
            $update_stmt = $db->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
            $update_stmt->execute([$quantity, $product_id]);
        }

        // Clear user's cart
        $clear_stmt = $db->prepare("DELETE FROM cart WHERE user_id = ?");
        $clear_stmt->execute([$user_id]);

        $db->commit();
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Pesanan berhasil dibuat',
            'order_id' => $order_id
        ]);

    } catch (Exception $e) {
        $db->rollBack();
        error_log("Transaction error: " . $e->getMessage());
        error_log("Stack trace: " . $e->getTraceAsString());
        throw $e;
    }

} catch (Exception $e) {
    error_log("Order creation error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());

    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage(),
        'debug' => [
            'file' => basename($e->getFile()),
            'line' => $e->getLine()
        ]
    ]);
}
?>
