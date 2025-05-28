<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

$database = new Database();
$db = $database->getKoneksi();

// Handle GET request to fetch products
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $sql = "SELECT * FROM products ORDER BY created_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Group products by category
        $grouped_products = [
            'alat' => [],
            'pupuk' => [],
            'bibit' => []
        ];

        foreach ($products as $product) {
            $grouped_products[$product['category']][] = $product;
        }

        echo json_encode([
            'status' => 'success',
            'data' => $grouped_products
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage()
        ]);
    }
}

// Handle POST request to add products
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Log incoming data
        error_log("Received POST data: " . print_r($_POST, true));
        error_log("Received FILES data: " . print_r($_FILES, true));

        // Validate required fields
        $required = ['name', 'description', 'price', 'category', 'stock'];
        foreach ($required as $field) {
            if (!isset($_POST[$field]) || empty($_POST[$field])) {
                throw new Exception("Field '$field' is required");
            }
        }

        // Create uploads directory if it doesn't exist
        $target_dir = __DIR__ . "/../../uploads/";
        if (!file_exists($target_dir)) {
            if (!mkdir($target_dir, 0777, true)) {
                throw new Exception("Failed to create uploads directory");
            }
        }

        $image_name = "";
        
        // Handle image upload
        if (isset($_FILES["image"]) && $_FILES["image"]["error"] == 0) {
            // Validate file type
            $allowed = ['image/jpeg', 'image/png', 'image/gif'];
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mime_type = finfo_file($finfo, $_FILES["image"]["tmp_name"]);
            finfo_close($finfo);

            if (!in_array($mime_type, $allowed)) {
                throw new Exception("Invalid file type. Only JPG, PNG and GIF allowed");
            }

            $ext = strtolower(pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION));
            $image_name = uniqid() . "." . $ext;
            $target_file = $target_dir . $image_name;
            
            if (!move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
                throw new Exception("Failed to upload image: " . error_get_last()['message']);
            }
        }

        // Insert product into database
        $sql = "INSERT INTO products (name, description, price, category, stock, image, created_at) 
                VALUES (:name, :description, :price, :category, :stock, :image, NOW())";
        
        $stmt = $db->prepare($sql);
        $params = [
            ':name' => strip_tags($_POST['name']),
            ':description' => strip_tags($_POST['description']),
            ':price' => floatval($_POST['price']),
            ':category' => strip_tags($_POST['category']),
            ':stock' => intval($_POST['stock']),
            ':image' => $image_name
        ];

        error_log("Executing SQL with params: " . print_r($params, true));
        
        $result = $stmt->execute($params);

        if (!$result) {
            throw new Exception("Database error: " . implode(", ", $stmt->errorInfo()));
        }

        http_response_code(201);
        echo json_encode([
            'status' => 'success',
            'message' => 'Product added successfully'
        ]);

    } catch(Exception $e) {
        error_log("Error adding product: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage()
        ]);
    }
}
?>