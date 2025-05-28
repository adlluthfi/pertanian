<?php
class Security {
    public static function sanitizeInput($input) {
        if (is_array($input)) {
            return array_map([self::class, 'sanitizeInput'], $input);
        }
        
        if (is_string($input)) {
            // Remove potentially dangerous characters
            $input = str_replace(['\\', "\0", "'", '"', "\x1a"], '', $input);
            // Convert special characters to HTML entities
            $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
        }
        
        return $input;
    }

    public static function validateInteger($value) {
        return filter_var($value, FILTER_VALIDATE_INT) !== false;
    }

    public static function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
}