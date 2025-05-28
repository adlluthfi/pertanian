<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';
require_once '../../utils/security.php';

$database = new Database();
$db = $database->getKoneksi();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        // Validate required fields
        if (!isset($data->user_id) || !isset($data->product_id)) {
            throw new Exception('Missing required fields');
        }

        // Sanitize and validate inputs
        $user_id = Security::sanitizeInput($data->user_id);
        $product_id = Security::sanitizeInput($data->product_id);
        
        if (!Security::validateInteger($user_id) || !Security::validateInteger($product_id)) {
            throw new Exception('Invalid input data');
        }

        // Start transaction
        $db->beginTransaction();

        // Check if cart item exists
        $checkSql = "SELECT c.quantity, p.stock 
                     FROM cart c 
                     JOIN products p ON c.product_id = p.id 
                     WHERE c.user_id = :user_id AND c.product_id = :product_id";
        $checkStmt = $db->prepare($checkSql);
        $checkStmt->execute([
            ':user_id' => $user_id,
            ':product_id' => $product_id
        ]);
        
        $item = $checkStmt->fetch(PDO::FETCH_ASSOC);
        if (!$item) {
            throw new Exception('Cart item not found');
        }

        if ($data->change === 'remove') {
            // Return stock to product
            $updateStockSql = "UPDATE products 
                              SET stock = stock + :quantity 
                              WHERE id = :product_id";
            $updateStockStmt = $db->prepare($updateStockSql);
            $updateStockStmt->execute([
                ':quantity' => $item['quantity'],
                ':product_id' => $product_id
            ]);

            // Delete cart item
            $sql = "DELETE FROM cart WHERE user_id = :user_id AND product_id = :product_id";
            $params = [
                ':user_id' => $user_id,
                ':product_id' => $product_id
            ];
        } else {
            // Calculate new quantity
            $change = Security::sanitizeInput($data->change);
            if (!is_numeric($change)) {
                throw new Exception('Invalid quantity change');
            }

            $newQuantity = max(1, $item['quantity'] + $change);
            
            // Check if new quantity is valid
            if ($change > 0 && $newQuantity > ($item['stock'] + $item['quantity'])) {
                throw new Exception('Insufficient stock');
            }

            // Update cart
            $sql = "UPDATE cart 
                    SET quantity = :new_quantity 
                    WHERE user_id = :user_id AND product_id = :product_id";
            $params = [
                ':new_quantity' => $newQuantity,
                ':user_id' => $user_id,
                ':product_id' => $product_id
            ];

            // Update product stock
            $stockChange = $change > 0 ? -$change : abs($change);
            $updateStockSql = "UPDATE products 
                              SET stock = stock + :change 
                              WHERE id = :product_id";
            $updateStockStmt = $db->prepare($updateStockSql);
            $updateStockStmt->execute([
                ':change' => $stockChange,
                ':product_id' => $product_id
            ]);
        }
        
        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        $db->commit();

        echo json_encode([
            'status' => 'success',
            'message' => 'Keranjang berhasil diperbarui'
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