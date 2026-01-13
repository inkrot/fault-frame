<?php
/**
 * Symfony 404 Not Found Error Response
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

http_response_code(404);

echo json_encode([
    'type' => 'https://symfony.com/errors/not-found',
    'title' => 'Not Found',
    'status' => 404,
    'detail' => 'No route found for "GET /api/users/999"'
], JSON_PRETTY_PRINT);
