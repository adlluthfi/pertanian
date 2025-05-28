<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';
require_once '../../utils/security.php';

$database = new Database();
$db = $database->getKoneksi();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get and validate JSON data
        $data = json_decode(file_get_contents("php://input"));
        
        // Sanitize and validate inputs
        $user_id = Security::sanitizeInput($data->user_id ?? '');
        $product_id = Security::sanitizeInput($data->product_id ?? '');
        $quantity = Security::sanitizeInput($data->quantity ?? 0);

        // Validate required fields
        if (!Security::validateInteger($user_id) || 
            !Security::validateInteger($product_id) || 
            !Security::validateInteger($quantity)) {
            throw new Exception('Invalid input data');
        }

        if ($quantity <= 0) {
            throw new Exception('Quantity must be greater than 0');
        }

        // Start transaction
        $db->beginTransaction();

        // Check if product exists and has enough stock
        $sql = "SELECT stock FROM products WHERE id = :product_id";
        $stmt = $db->prepare($sql);
        $stmt->execute([':product_id' => $product_id]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$product) {
            throw new Exception('Product not found');
        }

        if ($product['stock'] < $quantity) {
            throw new Exception('Insufficient stock');
        }

        // Check if product exists in cart
        $sql = "SELECT id, quantity FROM cart 
                WHERE user_id = :user_id AND product_id = :product_id";
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':user_id' => $user_id,
            ':product_id' => $product_id
        ]);
        $existing_item = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($existing_item) {
            // Update quantity if product exists
            $new_quantity = $existing_item['quantity'] + $quantity;
            if ($new_quantity > $product['stock']) {
                throw new Exception('Requested quantity exceeds available stock');
            }

            $sql = "UPDATE cart 
                    SET quantity = :new_quantity 
                    WHERE id = :id";
            $stmt = $db->prepare($sql);
            $stmt->execute([
                ':new_quantity' => $new_quantity,
                ':id' => $existing_item['id']
            ]);
        } else {
            // Insert new cart item
            $sql = "INSERT INTO cart (user_id, product_id, quantity) 
                    VALUES (:user_id, :product_id, :quantity)";
            $stmt = $db->prepare($sql);
            $stmt->execute([
                ':user_id' => $user_id,
                ':product_id' => $product_id,
                ':quantity' => $quantity
            ]);
        }

        // Update stock
        $sql = "UPDATE products 
                SET stock = stock - :quantity 
                WHERE id = :product_id";
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':quantity' => $quantity,
            ':product_id' => $product_id
        ]);

        // Commit transaction
        $db->commit();

        echo json_encode([
            'status' => 'success',
            'message' => 'Produk berhasil ditambahkan ke keranjang'
        ]);

    } catch(Exception $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage()
        ]);
    }
}
?>