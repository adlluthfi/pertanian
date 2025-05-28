<?php
// Define allowed origins
$allowedOrigins = array(
    'https://localhost:3000',
    'https://127.0.0.1:3000',
    'http://localhost:3000'  // Add this if you're not using HTTPS in development
);

// Check if origin is set and allowed
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $origin);
} else {
    // If origin is not allowed, return 403 Forbidden
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(403);
        exit();
    }
}

// Set other CORS headers
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 86400"); // Cache preflight request for 24 hours
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>