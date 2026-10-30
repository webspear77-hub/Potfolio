<?php
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT content_json, updated_at FROM portfolio_content ORDER BY id DESC LIMIT 1");
        $row = $stmt->fetch();
        if ($row && !empty($row['content_json'])) {
            $data = json_decode($row['content_json'], true);
            echo json_encode([
                "success" => true,
                "data" => $data,
                "updated_at" => $row['updated_at']
            ]);
        } else {
            echo json_encode([
                "success" => true,
                "data" => null,
                "message" => "No saved content yet, use default content"
            ]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
    exit();
}

if ($method === 'POST') {
    try {
        $raw = file_get_contents('php://input');
        if (empty($raw)) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Empty payload"]);
            exit();
        }

        // Validate JSON
        $decoded = json_decode($raw, true);
        if ($decoded === null) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Invalid JSON payload"]);
            exit();
        }

        // Store into portfolio_content table
        $stmt = $pdo->prepare("INSERT INTO portfolio_content (content_json) VALUES (:content)");
        $stmt->execute([':content' => $raw]);

        echo json_encode([
            "success" => true,
            "message" => "Portfolio content saved successfully to MySQL",
            "id" => $pdo->lastInsertId()
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
    exit();
}

http_response_code(405);
echo json_encode(["success" => false, "error" => "Method Not Allowed"]);
