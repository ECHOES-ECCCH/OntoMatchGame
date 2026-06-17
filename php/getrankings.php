<?php

ini_set('display_errors', 0);
error_reporting(0);

include("connect.php");

if (!$connection->ping()) {
    echo json_encode(["error" => $connection->error]);
    exit;
}

$catalogFileName = "scenariiCatalog.json";

// ===================== CLASSES =====================

class PlayerData {
    public $username;
    public $score;
}

class Scenario {
    public $scenarioName;
    public $ontologyName; // ✅ AJOUT
    public $maximumScore;
    public $playerData;
}

class Scenarii {
    public $scenario;
}

class Languages {
    public $languageName;
    public $scenarii;
}

class Leaderboard {
    public $languages;
}

// ===================== LOAD JSON =====================

$filePath = "../StreamingAssets/scenarii/" . $catalogFileName;
$string = file_get_contents($filePath);
$json_a = json_decode($string, true);

// ===================== LANGUAGES =====================

$langs = [];

foreach ($json_a['scenarii'] as $each) {
    if (!in_array($each['languageTag'], $langs)) {
        $langs[] = $each['languageTag'];
    }
}

// ===================== LEADERBOARD =====================

$leaderBoard = new Leaderboard();
$leaderBoard->languages = [];

foreach ($langs as $language) {

    $languageItem = new Languages();
    $languageItem->languageName = $language;

    $scenarii = new Scenarii();
    $scenarioArray = [];

    foreach ($json_a['scenarii'] as $scenario) {

        if (
            strcasecmp($scenario['scenario-title'], "YOUR GAME HERE!") != 0 &&
            strcasecmp($language, $scenario['languageTag']) == 0
        ) {

            $scenarioName = $scenario['scenario-title'];

            $scenarioItem = new Scenario();
            $scenarioItem->scenarioName = $scenarioName;

            // ✅ AJOUT ontologyName
            $scenarioItem->ontologyName = GetOntologyName($connection, $scenarioName);

            $scenarioItem->maximumScore = GetMaximumScore(
                $connection,
                $catalogFileName,
                $scenarioName
            );

            $playerData = [];
            GetPlayerData($connection, $scenarioName, $playerData);

            $scenarioItem->playerData = $playerData;

            $scenarioArray[] = $scenarioItem;
        }
    }

    $scenarii->scenario = $scenarioArray;
    $languageItem->scenarii = $scenarii;

    $leaderBoard->languages[] = $languageItem;
}

echo json_encode($leaderBoard);

// ===================== FUNCTIONS =====================

// 🔥 NOUVELLE FONCTION
function GetOntologyName($connection, $scenarioName)
{
    $sql = "
    SELECT Ontology.ontologyName
    FROM ontomatchgame.Scenario
    INNER JOIN ontomatchgame.Ontology 
        ON Scenario.ontologyId = Ontology.ontologyId
    WHERE Scenario.scenarioName = '{$scenarioName}'
    ";

    $result = mysqli_query($connection, $sql);

    if ($result && $result->num_rows > 0) {
        $row = mysqli_fetch_array($result);
        return $row['ontologyName'];
    }

    return "";
}

function GetMaximumScore($connection, $catalogFileName, $scenarioName)
{
    $listOfChapterFileNames = GetChapterFilesNames($catalogFileName, $scenarioName);

    $totalSum = 0;

    foreach ($listOfChapterFileNames as $chapterFileName) {
        $filePath = "../StreamingAssets/scenarii/" . $scenarioName . "/Chapters/" . $chapterFileName;

        if (!file_exists($filePath)) continue;

        $string = file_get_contents($filePath);
        $json_a = json_decode($string, true);

        foreach ($json_a as $score) {
            $totalSum += $score['Score'] ?? 0;
        }
    }

    return $totalSum;
}

function GetPlayerData($connection, $scenarioName, &$playerDataArray)
{
    $scenarioId = GetScenarioId($connection, $scenarioName);
    $historyIds = array_unique(GetHistoryIdsFromScenarioId($connection, $scenarioId));

    foreach ($historyIds as $historyId) {

        $playerData = new PlayerData();

        $playerData->username = GetUserName($connection, $historyId);
        $playerData->score = GetUserScore($connection, $historyId, $scenarioId);

        $playerDataArray[] = $playerData;
    }
}

function GetChapterFilesNames($catalogFileName, $scenarioName)
{
    $chapterFileNames = [];

    $catalogFilePath = "../StreamingAssets/scenarii/" . $catalogFileName;
    $string = file_get_contents($catalogFilePath);
    $json_a = json_decode($string, true);

    foreach ($json_a['scenarii'] as $scenario) {
        if (strcasecmp($scenario['scenario-title'], $scenarioName) == 0) {
            foreach ($scenario['chapters'] as $chapters) {
                $chapterFileNames[] = $chapters['chapter-filename'];
            }
        }
    }

    return $chapterFileNames;
}

function GetScenarioId($connection, $scenarioName)
{
    $sql = "SELECT scenarioId FROM ontomatchgame.Scenario WHERE scenarioName = '{$scenarioName}'";
    $result = mysqli_query($connection, $sql);

    if ($result && $result->num_rows > 0) {
        $row = mysqli_fetch_array($result);
        return $row["scenarioId"];
    }

    return null;
}

function GetHistoryIdsFromScenarioId($connection, $scenarioId)
{
    $list = [];

    $sql = "SELECT historyId FROM ontomatchgame.Session WHERE scenarioId = '{$scenarioId}'";
    $result = mysqli_query($connection, $sql);

    while ($row = mysqli_fetch_array($result)) {
        $list[] = $row['historyId'];
    }

    return $list;
}

function GetUserName($connection, $historyId)
{
    $sql = "SELECT userId FROM ontomatchgame.History WHERE historyId = '{$historyId}'";
    $result = mysqli_query($connection, $sql);

    if ($result && $result->num_rows > 0) {
        $row = mysqli_fetch_array($result);
        return GetNameFromId($connection, $row['userId']);
    }

    return null;
}

function GetNameFromId($connection, $userId)
{
    $sql = "SELECT username FROM ontomatchgame.UserAccount WHERE userId = '{$userId}'";
    $result = mysqli_query($connection, $sql);

    if ($result && $result->num_rows > 0) {
        $row = mysqli_fetch_array($result);
        return $row['username'];
    }

    return null;
}

function GetUserScore($connection, $historyId, $scenarioId)
{
    $userScore = 0;

    $sql = "SELECT Progression.score 
            FROM ontomatchgame.Progression 
            INNER JOIN ontomatchgame.Session 
            ON Progression.sessionId = Session.sessionId
            WHERE Session.historyId = '$historyId'
            AND Session.scenarioId = '$scenarioId'";

    $result = mysqli_query($connection, $sql);

    while ($row = mysqli_fetch_array($result)) {
        $userScore += $row['score'];
    }

    return $userScore;
}

mysqli_close($connection);
?>