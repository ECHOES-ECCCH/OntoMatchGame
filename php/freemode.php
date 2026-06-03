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
    echo json_encode([
        "error" => $message
    ]);
    exit();
}

function getOntologyIdByName($name, $connection)
{
    $stmt = $connection->prepare("
        SELECT ontologyId
        FROM ontology
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
// POST → CREATE FREEMODE GRAPH
// ==========================================================
if ($method === "POST") {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        ReturnError("JSON invalide");
    }

    $title = $data['title'] ?? null;
    $ontologyName = $data['ontologyName'] ?? null;
    $freemodeData = $data['freemodeData'] ?? null;

    if (!$title || !$ontologyName || !$freemodeData) {
        ReturnError("Champs manquants");
    }

    $ontologyId = getOntologyIdByName($ontologyName, $connection);

    if (!$ontologyId) {
        ReturnError("Ontology inconnue", 404);
    }

    $json = json_encode($freemodeData, JSON_UNESCAPED_UNICODE);

    if ($json === false) {
        ReturnError("Données invalides");
    }

    $stmt = $connection->prepare("
        INSERT INTO freemode (title, ontologyId, freemodeData)
        VALUES (?, ?, ?)
    ");
    $stmt->bind_param("sis", $title, $ontologyId, $json);
    $stmt->execute();

    if ($stmt->error) {
        ReturnError("Erreur interne", 500);
    }

    http_response_code(201);
    echo json_encode([
        "success" => true,
        "freemodeId" => $stmt->insert_id
    ]);

    exit;
}

// ==========================================================
// PUT → UPDATE FREEMODE GRAPH
// ==========================================================
if ($method === "PUT") {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data['id'])) {
        ReturnError("ID manquant");
    }

    $id = (int)$data['id'];

    $title = $data['title'] ?? null;
    $ontologyName = $data['ontologyName'] ?? null;
    $freemodeData = $data['freemodeData'] ?? null;

    if (!$title || !$ontologyName || !$freemodeData) {
        ReturnError("Champs manquants");
    }

    $ontologyId = getOntologyIdByName($ontologyName, $connection);

    if (!$ontologyId) {
        ReturnError("Ontology inconnue", 404);
    }

    $json = json_encode($freemodeData, JSON_UNESCAPED_UNICODE);

    $stmt = $connection->prepare("
        UPDATE freemode
        SET title = ?, ontologyId = ?, freemodeData = ?
        WHERE freemodeId = ?
    ");
    $stmt->bind_param("sisi", $title, $ontologyId, $json, $id);
    $stmt->execute();

    if ($stmt->error) {
        ReturnError("Erreur interne", 500);
    }

    if ($stmt->affected_rows === 0) {
        ReturnError("Freemode introuvable", 404);
    }

    echo json_encode(["success" => true]);
    exit;
}

// ==========================================================
// GET → LIST / BY ID / BY ONTOLOGY
// ==========================================================
if ($method === "GET") {

    if (isset($_GET['id'])) {

        $id = (int)$_GET['id'];

        $stmt = $connection->prepare("SELECT * FROM freemode WHERE freemodeId = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if (!$result || $result->num_rows === 0) {
            ReturnEmpty();
        }

        $row = mysqli_fetch_assoc($result);

        $row['freemodeData'] = json_decode($row['freemodeData'], true);

        echo json_encode($row);
        exit;
    }

    if (isset($_GET['ontologyId'])) {

        $ontologyId = (int)$_GET['ontologyId'];

        $stmt = $connection->prepare("SELECT * FROM freemode WHERE ontologyId = ? ORDER BY freemodeId DESC");
        $stmt->bind_param("i", $ontologyId);
        $stmt->execute();
        $result = $stmt->get_result();

        if (!$result || $result->num_rows === 0) {
            ReturnEmptyArray();
        }

        $data = [];

        while ($row = mysqli_fetch_assoc($result)) {
            $row['freemodeData'] = json_decode($row['freemodeData'], true);
            $data[] = $row;
        }

        echo json_encode($data);
        exit;
    }

    if (isset($_GET['ontologyName'])) {

        $ontologyName = $_GET['ontologyName'];

        $stmt = $connection->prepare("
            SELECT f.*
            FROM freemode f
            JOIN ontology o ON f.ontologyId = o.ontologyId
            WHERE o.ontologyName = ?
            ORDER BY f.freemodeId DESC
        ");

        $stmt->bind_param("s", $ontologyName);
        $stmt->execute();

        $result = $stmt->get_result();

        if (!$result || $result->num_rows === 0) {
            ReturnEmptyArray();
        }

        $data = [];

        while ($row = $result->fetch_assoc()) {
            $row['freemodeData'] = json_decode($row['freemodeData'], true);
            $data[] = $row;
        }

        echo json_encode($data);
        exit;
    }

    $query = "
        SELECT *
        FROM freemode
        ORDER BY freemodeId DESC
    ";

    $result = mysqli_query($connection, $query);

    if (!$result || $result->num_rows === 0) {
        ReturnEmptyArray();
    }

    $data = [];

    while ($row = mysqli_fetch_assoc($result)) {
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

    if (!isset($data['id'])) {
        ReturnError("ID manquant");
    }

    $id = (int)$data['id'];

    $stmt = $connection->prepare("DELETE FROM freemode WHERE freemodeId = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    if ($stmt->error) {
        ReturnError("Erreur interne", 500);
    }

    if ($stmt->affected_rows === 0) {
        ReturnError("Freemode introuvable", 404);
    }

    echo json_encode(["success" => true]);
    exit;
}

// ==========================================================
// METHOD NOT ALLOWED
// ==========================================================
ReturnError("Méthode non autorisée", 405);