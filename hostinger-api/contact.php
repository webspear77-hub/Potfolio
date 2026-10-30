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

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$category = trim($data['category'] ?? 'General Inquiry');
$message = trim($data['message'] ?? '');

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Name, email, and message are required fields."
    ]);
    exit();
}

try {
    $stmt = $pdo->prepare("INSERT INTO contact_messages (name, email, category, message) VALUES (:name, :email, :category, :message)");
    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':category' => $category,
        ':message' => $message
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Thank you! Your message has been received.",
        "id" => $pdo->lastInsertId()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
