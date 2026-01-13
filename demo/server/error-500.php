<?php
/**
 * Symfony 500 Error Response
 * Simulates a server error with full stack trace
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

http_response_code(500);

echo json_encode([
    'type' => 'https://tools.ietf.org/html/rfc2616#section-10',
    'title' => 'An error occurred',
    'status' => 500,
    'detail' => 'Warning: mkdir(): Permission denied',
    'class' => 'ErrorException',
    'trace' => [
        [
            'namespace' => 'App\\Service',
            'short_class' => 'FileUploadService',
            'class' => 'App\\Service\\FileUploadService',
            'type' => '->',
            'function' => 'uploadFile',
            'file' => '/var/www/app/src/Service/FileUploadService.php',
            'line' => 118,
            'args' => []
        ],
        [
            'namespace' => 'App\\Controller',
            'short_class' => 'UploadController',
            'class' => 'App\\Controller\\UploadController',
            'type' => '->',
            'function' => 'upload',
            'file' => '/var/www/app/src/Controller/UploadController.php',
            'line' => 42,
            'args' => []
        ],
        [
            'namespace' => 'Symfony\\Component\\HttpKernel',
            'short_class' => 'HttpKernel',
            'class' => 'Symfony\\Component\\HttpKernel\\HttpKernel',
            'type' => '->',
            'function' => 'handleRaw',
            'file' => '/var/www/app/vendor/symfony/http-kernel/HttpKernel.php',
            'line' => 163,
            'args' => []
        ]
    ]
], JSON_PRETTY_PRINT);
