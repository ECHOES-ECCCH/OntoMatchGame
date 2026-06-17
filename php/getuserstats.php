<?php
include("connect.php");
include("auth.php");
header('Content-Type: application/json');

if (!$connection->ping()) {
    printf ("Error: %s\n", $connection->error);
}

// Classe modèle
class UserScenarioStat
{
    public $userId;
    public $ontologyName;
    public $scenarioName;
    public $scenarioLanguage;
    public $chapterName;
    public $lastChallengeId;
    public $maxChallengeCount;
    public $score;
    public $maxPossibleScore;

    public function __construct($userId, $ontologyName, $scenarioName, $scenarioLanguage, $chapterName, $lastChallengeId, $maxChallengeCount, $score, $maxPossibleScore) 
    {
        $this->userId = $userId;
        $this->ontologyName = $ontologyName;
        $this->scenarioName = $scenarioName;
        $this->scenarioLanguage = $scenarioLanguage;
        $this->chapterName = $chapterName;
        $this->lastChallengeId = $lastChallengeId;
        $this->maxChallengeCount = $maxChallengeCount;
        $this->score = $score;
        $this->maxPossibleScore = $maxPossibleScore;
    }
}

// ================= MAIN =================

$userId = requireAuth();

$historyId = GetHistory($connection, $userId);
$progressions = GetProgressionIds($connection, $historyId, $userId);

echo json_encode($progressions);

// ================= FUNCTIONS =================

function GetProgressionIds($connection, $historyId, $userId)
{
    $progressions = array();

    $sql = "
    SELECT 
        Session.scenarioId, 
        Session.lastChapterId, 
        Progression.lastChallengeId, 
        Progression.score,
        Scenario.scenarioName,
        Ontology.ontologyName
    FROM ontomatchgame.Progression
    INNER JOIN ontomatchgame.Session 
        ON Progression.sessionId = Session.sessionId
    INNER JOIN ontomatchgame.Scenario 
        ON Session.scenarioId = Scenario.scenarioId
    INNER JOIN ontomatchgame.Ontology 
        ON Scenario.ontologyId = Ontology.ontologyId
    WHERE Session.historyId = '$historyId'
    ";

    $result = mysqli_query($connection, $sql);

    if ($result && $result->num_rows > 0)
    {
        while($row = mysqli_fetch_array($result))
        {
            $scenarioId = $row['scenarioId'];
            $scenarioName = $row['scenarioName'];
            $ontologyName = $row['ontologyName'];

            $lastChapterId = $row['lastChapterId'];
            $lastChallengeId = $row['lastChallengeId'];
            $score = $row['score'];

            $scenarioLanguage = GetScenarioLanguage($scenarioName);

            $chapterName = "";
            $maxChallengeCount = 0;
            $maxPossibleScore = 0;

            GetChapterData($connection, $lastChapterId, $scenarioName, $chapterName, $maxChallengeCount, $maxPossibleScore);

            $pIds = new UserScenarioStat(
                $userId,
                $ontologyName,
                $scenarioName,
                $scenarioLanguage,
                $chapterName,
                $lastChallengeId,
                $maxChallengeCount,
                $score,
                $maxPossibleScore
            );

            array_push($progressions, $pIds);   
        }
    }
    else
    {
        $pIds = new UserScenarioStat(-1, "", "", "", "", -1, -1, -1, -1);
        array_push($progressions, $pIds); 
    }

    return $progressions;    
}

function GetHistory($connection, $userId)
{
    $stmt = $connection->prepare("SELECT historyId FROM ontomatchgame.History WHERE userId = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0)
    {
        $row = $result->fetch_assoc();
        return $row['historyId'];
    }

    return null;
}

function GetScenarioLanguage($scenarioName)
{
    $filePath = "../StreamingAssets/scenarii/".$scenarioName."/".$scenarioName.".json";

    if (!file_exists($filePath)) return "";

    $string = file_get_contents($filePath);
    $json_a = json_decode($string, true);

    return $json_a['languageTag'] ?? "";
}

function GetChapterData($connection, $chapterId, $scenarioName, &$chapterName, &$maxChallengeCount, &$maxPossibleScore)
{
    $query = "SELECT chapterName FROM Chapter WHERE chapterId = $chapterId";
    $result = mysqli_query($connection, $query);

    if ($result && $result->num_rows > 0)
    {
        $row = mysqli_fetch_array($result);
        $chapterFileName = $row["chapterName"];
    }
    else
    {
        return;
    }

    $filePath = "../StreamingAssets/scenarii/".$scenarioName."/Chapters/".$chapterFileName;

    if (!file_exists($filePath)) return;

    $string = file_get_contents($filePath);
    $json_a = json_decode($string, true);

    $chapterName = $json_a[0]['Title'] ?? "";
    $maxChallengeCount = count($json_a) - 1;

    $sum = 0;
    foreach ($json_a as $item)
    {
        $sum += $item['Score'] ?? 0;
    }

    $maxPossibleScore = $sum;
}

mysqli_close($connection);
?>