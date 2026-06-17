<?php
include("connect.php");
include("auth.php");
header('Content-Type: application/json');

if (!$connection->ping()) {
  echo json_encode(["error" => $connection->error]);
  exit;
}

// ===================== DTO =====================
class historyModelDown
{
  public $historyId;
  public $scenarioName;
  public $chapterName;
  public $challengeId;
  public $score;
  public $ontologyName;

  public function __construct($id, $scenarioName, $chapterName, $challengeId, $score, $ontologyName) 
  {
    $this->historyId = $id;
    $this->scenarioName = $scenarioName;
    $this->chapterName = $chapterName;
    $this->challengeId = $challengeId;
    $this->score = $score;
    $this->ontologyName = $ontologyName;
  }
}

// ===================== INPUT =====================
$userId = requireAuth();

// ===================== GET HISTORY =====================
$stmt = $connection->prepare("SELECT historyId FROM History WHERE userId = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

if (!$result || $result->num_rows === 0) ReturnEmptyString();

$row = mysqli_fetch_array($result);
$id = $row["historyId"];

// ===================== GET LAST SESSION =====================
$query = "SELECT sessionId 
          FROM Session 
          WHERE historyId = '{$id}' 
          ORDER BY creation_date DESC 
          LIMIT 1";

$result = mysqli_query($connection, $query);
if (!$result || $result->num_rows === 0) ReturnEmptyString();

$row = mysqli_fetch_array($result);
$sessionId = $row["sessionId"];

// ===================== GET SESSION DATA =====================
$query = "SELECT scenarioId, lastChapterId 
          FROM Session 
          WHERE sessionId = $sessionId";

$result = mysqli_query($connection,$query);
if (!$result || $result->num_rows === 0) ReturnEmptyString();

$row = mysqli_fetch_array($result);
$scenarioId = $row["scenarioId"];
$lastChapterId = $row["lastChapterId"];

// ===================== GET SCENARIO NAME =====================
$query = "SELECT scenarioName FROM Scenario WHERE scenarioId = $scenarioId";
$result = mysqli_query($connection,$query);
if (!$result || $result->num_rows === 0) ReturnEmptyString();

$row = mysqli_fetch_array($result);
$scenarioName = $row["scenarioName"];

// ===================== GET ONTOLOGY NAME =====================
$ontologyName = GetOntologyName($connection, $scenarioId);

// ===================== GET CHAPTER NAME =====================
$query = "SELECT chapterName FROM Chapter WHERE chapterId = $lastChapterId";
$result = mysqli_query($connection,$query);
if (!$result || $result->num_rows === 0) ReturnEmptyString();

$row = mysqli_fetch_array($result);
$chapterName = $row["chapterName"];

// ===================== GET PROGRESSION =====================
$query = "SELECT progressionId FROM Progression WHERE sessionId = $sessionId";
$result = mysqli_query($connection,$query);
if (!$result || $result->num_rows === 0) ReturnEmptyString();

$row = mysqli_fetch_array($result);
$progressionId = $row["progressionId"];

// ===================== GET SCORE =====================
$query = "SELECT lastChallengeId, score 
          FROM Progression 
          WHERE progressionId = $progressionId";

$result = mysqli_query($connection,$query);
if (!$result || $result->num_rows === 0) ReturnEmptyString();

$row = mysqli_fetch_array($result);
$lastChallengeId = $row["lastChallengeId"];
$score = $row["score"];

// ===================== GET HUMAN CHAPTER NAME =====================
$realName = GetChapterHumanName($scenarioName, $chapterName);

// ===================== OUTPUT =====================
$instance = new historyModelDown(
  $id,
  $scenarioName,
  $realName,
  $lastChallengeId,
  $score,
  $ontologyName
);

echo json_encode($instance);

mysqli_close($connection);

// ===================== FUNCTIONS =====================

function ReturnEmptyString() {
    $instance = new historyModelDown("", "", "", "", "", "");
    echo json_encode($instance);
    exit();
}

function GetOntologyName($connection, $scenarioId)
{
    $sql = "
        SELECT Ontology.ontologyName
        FROM Scenario
        JOIN Ontology ON Scenario.ontologyId = Ontology.ontologyId
        WHERE Scenario.scenarioId = $scenarioId
    ";

    $result = mysqli_query($connection, $sql);

    if ($result && $result->num_rows > 0) {
        $row = mysqli_fetch_array($result);
        return $row["ontologyName"];
    }

    return "";
}

function GetChapterHumanName($scenarioName, $chapterName)
{
    $filePath = "../StreamingAssets/scenarii/".$scenarioName."/Chapters/".$chapterName;

    $json = file_get_contents($filePath);
    $json_data = json_decode($json,true);

    $challengeZero = $json_data[0];
    return $challengeZero['Title'] ?? "";
}
?>