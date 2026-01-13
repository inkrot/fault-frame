<?php
/**
 * Symfony 400 Validation Error Response
 * Simulates a validation error
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
    'type' => 'https://tools.ietf.org/html/rfc2616#section-10',
    'title' => 'Validation Failed',
    'status' => 400,
    'detail' => 'name: This value should not be blank.',
    'violations' => [
        [
            'propertyPath' => 'name',
            'message' => 'This value should not be blank.',
            'code' => 'c1051bb4-d103-4f74-8988-acbcafc7fdc3'
        ],
        [
            'propertyPath' => 'email',
            'message' => 'This value is not a valid email address.',
            'code' => 'bd79c0ab-ddba-46cc-a703-a7a4b08de310'
        ]
    ]
], JSON_PRETTY_PRINT);
