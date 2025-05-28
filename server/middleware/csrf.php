<?php
function verifyCsrfToken() {
    // Get CSRF token from header
    $csrfToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
    
    if (!$csrfToken) {
        http_response_code(403);
        echo json_encode([
            'status' => 'error',
            'message' => 'CSRF token missing'
        ]);
        exit;
    }

    // Validate token format
    if (!preg_match('/^[a-zA-Z0-9]+$/', $csrfToken)) {
        http_response_code(403);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid CSRF token'
        ]);
        exit;
    }
}