<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';
require_once '../../utils/security.php';

$database = new Database();
$db = $database->getKoneksi();

// Handle POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get JSON data
        $data = json_decode(file_get_contents("php://input"));
        
        // Validate required fields
        if (!$data || !isset($data->order_id) || !isset($data->card_info)) {
            throw new Exception('Data pembayaran tidak lengkap');
        }

        // Sanitize and validate inputs
        $order_id = Security::sanitizeInput($data->order_id);
        $card_number = Security::sanitizeInput($data->card_info->cardNumber ?? '');
        $card_holder = Security::sanitizeInput($data->card_info->cardHolder ?? '');
        $expiry_date = Security::sanitizeInput($data->card_info->expiryDate ?? '');

        // Validate data types and formats
        if (!Security::validateInteger($order_id)) {
            throw new Exception('ID pesanan tidak valid');
        }

        if (empty($card_number) || empty($card_holder) || empty($expiry_date)) {
            throw new Exception('Informasi kartu tidak lengkap');
        }

        // Start transaction
        $db->beginTransaction();
        
        // Check if order exists and not already paid
        $stmt = $db->prepare("SELECT id, status FROM orders WHERE id = ?");
        $stmt->execute([$order_id]);
        $order = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$order) {
            throw new Exception('Pesanan tidak ditemukan');
        }

        if ($order['status'] === 'paid') {
            throw new Exception('Pesanan sudah dibayar');
        }

        // Check for duplicate payment
        $stmt = $db->prepare("SELECT id FROM payment_details WHERE order_id = ?");
        $stmt->execute([$order_id]);
        if ($stmt->rowCount() > 0) {
            throw new Exception('Pembayaran untuk pesanan ini sudah ada');
        }

        // Insert payment details
        $stmt = $db->prepare("INSERT INTO payment_details (
            order_id, card_number, card_holder, expiry_date, payment_status
        ) VALUES (?, ?, ?, ?, 'completed')");
        
        $stmt->execute([
            $order_id,
            $card_number,
            $card_holder,
            $expiry_date
        ]);
        
        // Update order status
        $stmt = $db->prepare("UPDATE orders SET status = 'paid' WHERE id = ?");
        $stmt->execute([$order_id]);
        
        $db->commit();
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Pembayaran berhasil diproses'
        ]);
        
    } catch(Exception $e) {
        if ($db && $db->inTransaction()) {
            $db->rollBack();
        }
        error_log('Payment Error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage()
        ]);
    }
}
?>