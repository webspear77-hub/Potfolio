<?php
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method Not Allowed"]);
    exit();
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    $data = $_POST;
}

$email = trim($data['email'] ?? '');

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Valid email is required."]);
    exit();
}

try {
    $stmt = $pdo->prepare("INSERT INTO cv_requests (email) VALUES (:email)");
    $stmt->execute([':email' => $email]);

    echo json_encode([
        "success" => true,
        "message" => "CV request recorded successfully.",
        "id" => $pdo->lastInsertId()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
