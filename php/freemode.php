<?php

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include("connect.php");

// ===================== CHECK CONNECTION =====================
if (!$connection->ping()) {
    http_response_code(500);
    echo json_encode(["error" => $connection->error]);
    exit;
}

// ===================== HELPERS =====================
function ReturnEmpty()
{
    http_response_code(404);
    echo json_encode(null);
    exit();
}

function ReturnEmptyArray()
{
    echo json_encode([]);
    exit();
}

function ReturnError($message, $code = 400)
{
    http_response_code($code);
    echo json_encode(["error" => $message]);
    exit();
}

// ===================== ONTOLOGY RESOLVE =====================
function getOntologyIdByName($name, $connection)
{
    $stmt = $connection->prepare("
        SELECT ontologyId
        FROM Ontology
        WHERE ontologyName = ?
        LIMIT 1
    ");

    $stmt->bind_param("s", $name);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        return (int)$row['ontologyId'];
    }

    return null;
}

// ===================== ROUTING =====================
$method = $_SERVER['REQUEST_METHOD'];


// ==========================================================
// POST → CREATE FREEMODE
// ==========================================================
if ($method === "POST") {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        ReturnError("JSON invalide");
    }

    $title = $data['title'] ?? null;
    $ontologyName = $data['ontologyName'] ?? null;
    $userId = $data['userId'] ?? null;
    $freemodeData = $data['freemodeData'] ?? null;

    if (!$title || !$ontologyName || !$userId || !$freemodeData) {
        ReturnError("Champs manquants");
    }

    $ontologyId = getOntologyIdByName($ontologyName, $connection);

    if (!$ontologyId) {
        ReturnError("Ontology inconnue", 404);
    }

    $json = json_encode($freemodeData, JSON_UNESCAPED_UNICODE);

    if ($json === false) {
        ReturnError("JSON invalide");
    }

    $stmt = $connection->prepare("
        INSERT INTO Freemode (title, ontologyId, userId, freemodeData)
        VALUES (?, ?, ?, ?)
    ");

    $stmt->bind_param("siis", $title, $ontologyId, $userId, $json);
    $stmt->execute();

    if ($stmt->error) {
        ReturnError("Erreur interne", 500);
    }

    echo json_encode([
        "success" => true,
        "freemodeId" => $stmt->insert_id
    ]);
    exit;
}


// ==========================================================
// PUT → UPDATE
// ==========================================================
if ($method === "PUT") {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data['id'])) {
        ReturnError("ID manquant");
    }

    $id = (int)$data['id'];

    $title = $data['title'] ?? null;
    $ontologyName = $data['ontologyName'] ?? null;
    $userId = $data['userId'] ?? null;
    $freemodeData = $data['freemodeData'] ?? null;

    if (!$title || !$ontologyName || !$userId || !$freemodeData) {
        ReturnError("Champs manquants");
    }

    $ontologyId = getOntologyIdByName($ontologyName, $connection);

    if (!$ontologyId) {
        ReturnError("Ontology inconnue", 404);
    }

    $json = json_encode($freemodeData, JSON_UNESCAPED_UNICODE);

    $stmt = $connection->prepare("
        UPDATE Freemode
        SET title = ?, ontologyId = ?, freemodeData = ?
        WHERE freemodeId = ? AND userId = ?
    ");

    $stmt->bind_param("sisii", $title, $ontologyId, $json, $id, $userId);
    $stmt->execute();

    if ($stmt->error) {
        ReturnError("Erreur interne", 500);
    }

    if ($stmt->affected_rows === 0) {
        ReturnError("Introuvable ou non autorisé", 404);
    }

    echo json_encode(["success" => true]);
    exit;
}


// ==========================================================
// GET
// ==========================================================
if ($method === "GET") {

    // BY ID
    if (isset($_GET['id'])) {

        $id = (int)$_GET['id'];

        $stmt = $connection->prepare("
            SELECT * FROM Freemode
            WHERE freemodeId = ?
        ");

        $stmt->bind_param("i", $id);
        $stmt->execute();

        $result = $stmt->get_result();

        if (!$result || $result->num_rows === 0) {
            ReturnEmpty();
        }

        $row = $result->fetch_assoc();
        $row['freemodeData'] = json_decode($row['freemodeData'], true);

        echo json_encode($row);
        exit;
    }

        if (isset($_GET['ontologyName']) && isset($_GET['userId'])) {

    $ontologyName = $_GET['ontologyName'];
    $userId = (int)$_GET['userId'];

    $ontologyId = getOntologyIdByName($ontologyName, $connection);

    $stmt = $connection->prepare("
        SELECT *
        FROM Freemode
        WHERE ontologyId = ? AND userId = ?
        ORDER BY freemodeId DESC
    ");

    $stmt->bind_param("ii", $ontologyId, $userId);
    $stmt->execute();

    $result = $stmt->get_result();

    $data = [];

    while ($row = $result->fetch_assoc()) {
        $row['freemodeData'] = json_decode($row['freemodeData'], true);
        $data[] = $row;
    }

    echo json_encode($data);
    exit;
}

    // BY USER
    if (isset($_GET['userId'])) {

        $userId = (int)$_GET['userId'];

        $stmt = $connection->prepare("
            SELECT *
            FROM Freemode
            WHERE userId = ?
            ORDER BY freemodeId DESC
        ");

        $stmt->bind_param("i", $userId);
        $stmt->execute();

        $result = $stmt->get_result();

        $data = [];

        while ($row = $result->fetch_assoc()) {
            $row['freemodeData'] = json_decode($row['freemodeData'], true);
            $data[] = $row;
        }

        echo json_encode($data);
        exit;
    }



    // ALL
    $result = $connection->query("
        SELECT * FROM Freemode
        ORDER BY freemodeId DESC
    ");

    $data = [];

    while ($row = $result->fetch_assoc()) {
        $row['freemodeData'] = json_decode($row['freemodeData'], true);
        $data[] = $row;
    }

    echo json_encode($data);
    exit;
}


// ==========================================================
// DELETE
// ==========================================================
if ($method === "DELETE") {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['id']) || !isset($data['userId'])) {
        ReturnError("ID ou userId manquant");
    }

    $id = (int)$data['id'];
    $userId = (int)$data['userId'];

    $stmt = $connection->prepare("
        DELETE FROM Freemode
        WHERE freemodeId = ? AND userId = ?
    ");

    $stmt->bind_param("ii", $id, $userId);
    $stmt->execute();

    if ($stmt->error) {
        ReturnError("Erreur interne", 500);
    }

    if ($stmt->affected_rows === 0) {
        ReturnError("Introuvable ou non autorisé", 404);
    }

    echo json_encode(["success" => true]);
    exit;
}


// ==========================================================
// ERROR
// ==========================================================
ReturnError("Méthode non autorisée", 405);

?>