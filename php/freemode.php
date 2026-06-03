<?php

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include("connect.php");

// ===================== CHECK CONNECTION =====================
if (!$connection->ping()) {
    echo json_encode(["error" => $connection->error]);
    exit;
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
    $ontologyId = $data['ontologyId'] ?? null;
    $freemodeData = $data['freemodeData'] ?? null;

    if (!$title || !$ontologyId || !$freemodeData) {
        ReturnError("Champs manquants");
    }

    $title = mysqli_real_escape_string($connection, $title);

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

    echo json_encode([
        "success" => true,
        "freemodeId" => mysqli_insert_id($connection)
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
    $ontologyId = $data['ontologyId'] ?? null;
    $freemodeData = $data['freemodeData'] ?? null;

    if (!$title || !$ontologyId || !$freemodeData) {
        ReturnError("Champs manquants");
    }

    $title = mysqli_real_escape_string($connection, $title);

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
        WHERE freemodeId = $id
    ";

    $result = mysqli_query($connection, $query);

    if (!$result) {
        ReturnError($connection->error);
    }

    echo json_encode(["success" => true]);
    exit;
}

// ==========================================================
// GET → LIST / BY ID / BY ONTOLOGY
// ==========================================================
if ($method === "GET") {

    // ===================== GET BY ID =====================
    if (isset($_GET['id'])) {

        $id = (int)$_GET['id'];

        $query = "
            SELECT *
            FROM freemode
            WHERE freemodeId = $id
        ";

        $result = mysqli_query($connection, $query);

        if (!$result || $result->num_rows === 0) {
            ReturnEmpty();
        }

        $row = mysqli_fetch_assoc($result);

        $row['freemodeData'] = json_decode(
            $row['freemodeData'],
            true
        );

        echo json_encode($row);
        exit;
    }

    // ===================== GET BY ONTOLOGY =====================
    if (isset($_GET['ontologyId'])) {

        $ontologyId = (int)$_GET['ontologyId'];

        $query = "
            SELECT *
            FROM freemode
            WHERE ontologyId = $ontologyId
            ORDER BY freemodeId DESC
        ";

        $result = mysqli_query($connection, $query);

        if (!$result || $result->num_rows === 0) {
            ReturnEmptyArray();
        }

        $data = [];

        while ($row = mysqli_fetch_assoc($result)) {

            $row['freemodeData'] = json_decode(
                $row['freemodeData'],
                true
            );

            $data[] = $row;
        }

        echo json_encode($data);
        exit;
    }

    // ===================== GET ALL =====================

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

        $row['freemodeData'] = json_decode(
            $row['freemodeData'],
            true
        );

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

    $query = "
        DELETE FROM freemode
        WHERE freemodeId = $id
    ";

    $result = mysqli_query($connection, $query);

    if (!$result) {
        ReturnError($connection->error);
    }

    echo json_encode(["success" => true]);
    exit;
}

// ==========================================================
// METHOD NOT ALLOWED
// ==========================================================
http_response_code(405);
ReturnError("Méthode non autorisée");

// ==========================================================
// FUNCTIONS
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