<?php
$mysqli = new mysqli("localhost", "root", "", "pwa_crud");

if ($mysqli->connect_error) {
    die("Error de conexión: " . $mysqli->connect_error);
}

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $result = $mysqli->query("SELECT * FROM users");
        $users = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($users);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['id']) && $data['id'] !== '') {
            $stmt = $mysqli->prepare("UPDATE users SET name = ?, email = ? WHERE id = ?");
            $stmt->bind_param("ssi", $data['name'], $data['email'], $data['id']);
        } else {
            $stmt = $mysqli->prepare("INSERT INTO users (name, email) VALUES (?, ?)");
            $stmt->bind_param("ss", $data['name'], $data['email']);
        }
        $stmt->execute();
        echo json_encode(["status" => "success"]);
        break;

    case 'DELETE':
        parse_str(file_get_contents("php://input"), $data);
        $stmt = $mysqli->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bind_param("i", $data['id']);
        $stmt->execute();
        echo json_encode(["status" => "deleted"]);
        break;
}
