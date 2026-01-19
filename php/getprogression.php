<?php
    //DTO
    class ProgressionModelDown
    {
      public $LastChallengeId;
      public $Score;

      public function __construct($challengeId, $score) 
      {
            $this->LastChallengeId = $challengeId;
            $this->Score = $score;
      }
    }

    include("connect.php");
    header('Content-Type: application/json');

    if (!$connection->ping()) {
      printf ("Error: %s\n", $connection->error);
    }

    $userId = $_GET["UserId"];
    $scenarioName = $_GET["ScenarioName"];
    $chapterName = $_GET["ChapterName"];

    if($userId != null)
    {
        $historyId  = GetHistory($connection, $userId);
        // echo "historyId : ".$historyId;
        // echo "\n";
        $scenarioId = GetScenarioID($connection, $scenarioName);
        // echo "scenarioId : ".$scenarioId;
        // echo "\n";
        $chapterId = GetChapterID($connection, $scenarioId, $chapterName);
        // echo "chapterId : ".$chapterId;
        // echo "\n";
        $sessionId = GetSessionId($connection, $historyId, $scenarioId, $chapterId);
        // echo "sessionId : ".$sessionId;
        // echo "\n";
        $progressionData = GetProgression($connection, $sessionId, $chapterId);

        echo json_encode($progressionData);
        // echo "progressionId : ".$progressionData->;
        // echo "\n";
        // echo "lastChallengeId : ".$progressionData->LastChallengeId;
        // echo "\n";
        // echo "Score : ".$progressionData->Score;
        // echo "\n";



    }

    function GetHistory($connection, $userId)
    {
        $sql = "SELECT * FROM ontomatchgame.History WHERE ontomatchgame.History.userId = $userId";
        $result = mysqli_query($connection, $sql);

        if($result)
        {
            if($result -> num_rows > 0)
            {
                while($row = mysqli_fetch_array($result))
                {
                    $historyId = $row['historyId'];
                }
            }
        }
        return $historyId;
    }

    function GetScenarioID($connection, $scenarioName)
    {
        if($scenarioName != null)
        {
            $sql = "SELECT * FROM ontomatchgame.Scenario WHERE ontomatchgame.Scenario.scenarioName = '{$scenarioName}'";
            $result = mysqli_query($connection, $sql);

            if($result)
            {
                if($result -> num_rows > 0)
                {
                    while($row = mysqli_fetch_array($result))
                    {
                        $scenarioId = $row['scenarioId'];
                    }
                }
                else
                {
                    $scenarioId = -1;
                }
            }
        }
        else
        {
            $scenarioId = -1;
        }
        
        return $scenarioId;
    }

    function GetChapterID($connection, $scenarId, $chapName)
    {
        if($scenarId != null && $chapName != null)
        {
            $sql = " SELECT * FROM ontomatchgame.Chapter WHERE ontomatchgame.Chapter.scenarioId = $scenarId AND ontomatchgame.Chapter.chapterName = '{$chapName}' ";
            $result = mysqli_query($connection, $sql);

            if($result)
            {
                if($result -> num_rows > 0)
                {
                    while($row = mysqli_fetch_array($result))
                    {
                        $chapterId = $row['chapterId'];
                    }
                }
                else
                {
                    $chapterId = -1;
                }
            }
        }
        else
        {
            $chapterId = -1;
        }

        return $chapterId;
    }

    function GetSessionID($connection, $histId, $scenarId, $chapId)
    {
        if($histId != null && $scenarId != null && $chapId != null)
        {
            $sql = " SELECT * FROM ontomatchgame.Session WHERE ontomatchgame.Session.historyId = $histId AND ontomatchgame.Session.scenarioId = '{$scenarId}' AND ontomatchgame.Session.lastChapterId = '{$chapId}'";
            $result = mysqli_query($connection, $sql);

            if($result)
            {
                if($result -> num_rows > 0)
                {
                    while($row = mysqli_fetch_array($result))
                    {
                        $sessionId = $row['sessionId'];
                    }
                }
                else
                {
                    $sessionId = -1;
                }
            }
        }
        else
        {
            $sessionId = -1;
        }
        return $sessionId;
    }

    function GetProgression($connection, $sessId, $chapId)
    {
        if($sessId != null && $chapId != null)
        {
            $sql = " SELECT * FROM ontomatchgame.Progression WHERE ontomatchgame.Progression.sessionId = $sessId AND ontomatchgame.Progression.chapterId = '{$chapId}' ";
            $result = mysqli_query($connection, $sql);

            if($result)
            {
                if($result -> num_rows > 0)
                {
                    while($row = mysqli_fetch_array($result))
                    {
                        $lastChallenge = $row['lastChallengeId'];
                        $score = $row['score'];
                        //$progressionId = $row['progressionId'];
                    }
                }
                else
                {
                    $progressionId = -1;
                    $lastChallenge = -1;
                    $score = -1; 
                }
            }
        }
        else
        {
            $progressionId = -1;
            $lastChallenge = -1;
            $score = -1;      
        }

        // echo "Last challenge : ".$lastChallenge;
        // echo "\n";
        // echo "Score : ".$score;
        // echo "\n";

        //$progressionData = array($progressionId, $lastChallenge, $score);
        $progressionData = new ProgressionModelDown($lastChallenge, $score);
        return $progressionData;
    }

    mysqli_close($connection);
?>