<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';

$database = new Database();
$db = $database->getKoneksi();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!$data || !isset($data->user_id) || !isset($data->training_id)) {
            throw new Exception('Invalid registration data');
        }

        $db->beginTransaction();

        // Check if already registered
        $sql = "SELECT COUNT(*) FROM training_registrations 
                WHERE training_id = :training_id AND user_id = :user_id";
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':training_id' => $data->training_id,
            ':user_id' => $data->user_id
        ]);
        
        if ($stmt->fetchColumn() > 0) {
            throw new Exception('Already registered for this training');
        }

        // Check quota
        $sql = "SELECT quota, registered FROM trainings WHERE id = :training_id";
        $stmt = $db->prepare($sql);
        $stmt->execute([':training_id' => $data->training_id]);
        $training = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($training['registered'] >= $training['quota']) {
            throw new Exception('Training quota is full');
        }

        // Register user
        $sql = "INSERT INTO training_registrations (training_id, user_id) 
                VALUES (:training_id, :user_id)";
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':training_id' => $data->training_id,
            ':user_id' => $data->user_id
        ]);

        // Update registered count
        $sql = "UPDATE trainings 
                SET registered = registered + 1 
                WHERE id = :training_id";
        $stmt = $db->prepare($sql);
        $stmt->execute([':training_id' => $data->training_id]);

        $db->commit();
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Registration successful'
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