<?php
require_once __DIR__ . '/../utils/RateLimiter.php';

function checkRateLimit($identifier, $maxAttempts = 5, $decayMinutes = 15) {
    $limiter = new RateLimiter($maxAttempts, $decayMinutes);
    $key = "auth:{$identifier}";

    if ($limiter->tooManyAttempts($key)) {
        http_response_code(429);
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'error',
            'message' => 'Terlalu banyak percobaan login. Silakan coba lagi dalam beberapa menit.',
            'retry_after' => $limiter->availableIn($key)
        ]);
        exit;
    }

    $limiter->hit($key);
}