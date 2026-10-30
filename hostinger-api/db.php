<?php
// CORS headers to allow requests from your Netlify website and localhost
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database configuration for Hostinger
define('DB_HOST', 'localhost');
define('DB_NAME', 'u835254770_Smitaportfolio');
define('DB_USER', 'u835254770_Smitaportfolio');
// Replace YOUR_DB_PASSWORD_HERE with the password you set when creating the database
define('DB_PASS', 'YOUR_DB_PASSWORD_HERE');

function getDbConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error" => "Database connection failed: " . $e->getMessage()
        ]);
        exit();
    }
}
