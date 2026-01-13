<?php
/**
 * Simple Error Response (Generic API)
 * No stack trace, just error message
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

http_response_code(400);

echo json_encode([
    'success' => false,
    'error' => 'Message text or files are required'
], JSON_PRETTY_PRINT);
