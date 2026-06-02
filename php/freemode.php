<?php
header('Content-Type: application/json');

include("connect.php");

// ===================== CHECK CONNECTION =====================
if (!$connection->ping()) {
    echo json_encode(["error" => $connection->error]);
    exit;
}

// ===================== ROUTING =====================
$method = $_SERVER['REQUEST_METHOD'];

// ==========================================================
// 🔥 POST → CREATE FREEMODE GRAPH
// ==========================================================
if ($method === "POST") {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        ReturnError("JSON invalide");
    }

    $title = $data['title'] ?? null;
    $ontologyId = $data['ontologyId'] ?? null;
    $freemodeData = $data['freemodeData'] ?? null;

    if (!$title || !$ontologyId || !$freemodeData) {
        ReturnError("Champs manquants");
    }

    $json = mysqli_real_escape_string(
        $connection,
        json_encode($freemodeData, JSON_UNESCAPED_UNICODE)
    );

    $query = "
        INSERT INTO freemode (title, ontologyId, freemodeData)
        VALUES ('$title', '$ontologyId', '$json')
    ";

    $result = mysqli_query($connection, $query);

    if (!$result) {
        ReturnError($connection->error);
    }

    echo json_encode(["success" => true]);
    exit;
}

// ==========================================================
// 🔥 PUT → CREATE FREEMODE GRAPH
// ==========================================================

if ($method === "PUT") {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data['id'])) {
        ReturnError("ID manquant");
    }

    $id = $data['id'];
    $title = $data['title'] ?? null;
    $ontologyId = $data['ontologyId'] ?? null;
    $freemodeData = $data['freemodeData'] ?? null;

    if (!$title || !$ontologyId || !$freemodeData) {
        ReturnError("Champs manquants");
    }

    $json = mysqli_real_escape_string(
        $connection,
        json_encode($freemodeData, JSON_UNESCAPED_UNICODE)
    );

    $query = "
        UPDATE freemode
        SET 
            title = '$title',
            ontologyId = '$ontologyId',
            freemodeData = '$json'
        WHERE id = $id
    ";

    $result = mysqli_query($connection, $query);

    if (!$result) {
        ReturnError($connection->error);
    }

    echo json_encode(["success" => true]);
    exit;
}

// ==========================================================
// 🔥 GET → LIST / BY ID / BY ONTOLOGY
// ==========================================================
if ($method === "GET") {

    // ===================== GET BY ID =====================
    if (isset($_GET['id'])) {

        $id = $_GET['id'];

        $query = "SELECT * FROM freemode WHERE id = $id";
        $result = mysqli_query($connection, $query);

        if (!$result || $result->num_rows === 0) {
            ReturnEmpty();
        }

        $row = mysqli_fetch_array($result);

        $row['freemodeData'] = json_decode($row['freemodeData'], true);

        echo json_encode($row);
        exit;
    }

    // ===================== GET BY ONTOLOGY =====================
    if (isset($_GET['ontologyId'])) {

        $ontologyId = $_GET['ontologyId'];

        $query = "SELECT * FROM freemode WHERE ontologyId = $ontologyId";
        $result = mysqli_query($connection, $query);

        if (!$result || $result->num_rows === 0) {
            ReturnEmptyArray();
        }

        $data = [];

        while ($row = mysqli_fetch_array($result)) {

            $row['freemodeData'] = json_decode($row['freemodeData'], true);
            $data[] = $row;
        }

        echo json_encode($data);
        exit;
    }

    // ===================== GET ALL =====================
    $query = "SELECT * FROM freemode";
    $result = mysqli_query($connection, $query);

    if (!$result || $result->num_rows === 0) {
        ReturnEmptyArray();
    }

    $data = [];

    while ($row = mysqli_fetch_array($result)) {

        $row['freemodeData'] = json_decode($row['freemodeData'], true);
        $data[] = $row;
    }

    echo json_encode($data);
    exit;
}

// ==========================================================
// 🔥 DELETE
// ==========================================================
if ($method === "DELETE") {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['id'])) {
        ReturnError("ID manquant");
    }

    $id = $data['id'];

    $query = "DELETE FROM freemode WHERE id = $id";
    $result = mysqli_query($connection, $query);

    if (!$result) {
        ReturnError($connection->error);
    }

    echo json_encode(["success" => true]);
    exit;
}

// ==========================================================
// ❌ METHOD NOT ALLOWED
// ==========================================================
ReturnError("Méthode non autorisée");

// ==========================================================
// 🧠 FUNCTIONS (comme ton style projet)
// ==========================================================

function ReturnEmpty()
{
    echo json_encode(null);
    exit();
}

function ReturnEmptyArray()
{
    echo json_encode([]);
    exit();
}

function ReturnError($message)
{
    echo json_encode([
        "error" => $message
    ]);
    exit();
}

?>