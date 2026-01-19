<?php
    include("connect.php");

    header('Content-Type: application/json');

    if (!$connection->ping()) {
      printf ("Error: %s\n", $connection->error);
    }

    //DTO down, bool result
    class ResetModelDown
    {
      public $result;

      public function __construct($b) 
      {
          $this->result = $b;
      }
    }

    $body = file_get_contents('php://input');//Needed because data are json, not from xxx-form-encoded
    $parsed = json_decode($body);
    
    //UserId field
    if(isset($parsed->userId))
    {
        $userId = $parsed->userId;
    }
    else
    {
        error_log("[OntoMatchGame] UserId field not found. Can't reset session.", 0);
        exit("[OntoMatchGame] UserId field not found. Can't update session.");
    }

    //ScenarioTitle field
    if(isset($parsed->currentScenario))
    {
        $scenarioTitle = $parsed->currentScenario;
    }
    else
    {
        error_log("[OntoMatchGame] scenarioTitle field empty. Can't update session.", 0);
        exit("[OntoMatchGame] scenarioTitle field empty. Can't update session.");
    }

    //ChapterTitle field
    if(isset($parsed->currentChapter))
    {
        $chapterTitle = $parsed->currentChapter;
    }
    else
    {
        error_log("[OntoMatchGame] chapterTitle field empty. Can't update session.", 0);
        exit("[OntoMatchGame] chapterTitle field empty. Can't update session.");
    }

    //Fetch HistoryId from UserId
    $query = " SELECT * FROM ontomatchgame.History WHERE ontomatchgame.History.userId = $userId ";    
    $result = mysqli_query($connection,$query);
    if ($result)
    {
        if ($result->num_rows > 0)//Email found
        {
            while ($row = mysqli_fetch_array($result))
            { 
                $historyId = $row['historyId'];
                //echo "History id : ".$historyId."\n";
            }
        }
        else
        {
            ReturnEmptyString();
        }
    }
    else
    {
        error_log("[Create Session] PB while querying HistoryId. Please contact administrator.", 0);
    }

    $scenarioId = GetScenarioID($connection, $scenarioTitle);
    $chapterId = GetChapterID($connection, $scenarioId, $chapterTitle);
    $sessionId = GetSessionID($connection, $historyId, $scenarioId, $chapterId);

    //Fetch Progression from SessionId and ChapterId
    if($sessionId != -1)
    {
        $query = " SELECT * FROM ontomatchgame.Progression WHERE ontomatchgame.Progression.sessionId  = $sessionId AND ontomatchgame.Progression.chapterId = $chapterId";    
        $result = mysqli_query($connection,$query);
        if($result)
        {
            if($result -> num_rows > 0)
            {
                while($row = mysqli_fetch_array($result))
                {
                    $progressionId = $row['progressionId'];
                    //echo "progressionId: ".$progressionId."\n";
                }
            }
            else
            {
                $progressionId = -1;
            }
        }
    }

    //Reset Progression
    $query = " UPDATE ontomatchgame.Progression SET sessionId=$sessionId, chapterId=$chapterId, lastChallengeId=1, score=0 WHERE progressionId='{$progressionId}' AND sessionId='{$sessionId}' AND chapterId='{$chapterId}' ";

    $result = mysqli_query($connection, $query);

    if ($result)
    {
        $boolResult = new ResetModelDown(true);
        // echo json_encode($boolResult);
        // error_log(" [ENCODE true]".$boolResult->result);
    }
    else
    {
        $boolResult = new ResetModelDown(false);
        // echo json_encode($boolResult);
        // error_log("[ENCODE false] -> ".$boolResult->result);
    }

    if($boolResult == true)
    {
        //Reset Session
        $query = " UPDATE ontomatchgame.Session SET lastChapterId=$chapterId WHERE historyId='{$historyId}' AND scenarioId='{$scenarioId}' AND lastChapterId='{$chapterId}' ";

        $result = mysqli_query($connection, $query);

        if ($result)
        {
            $boolResult = new ResetModelDown(true);
            echo json_encode($boolResult);
            error_log(" [ENCODE true]".$boolResult->result);
        }
        else
        {
            $boolResult = new ResetModelDown(false);
            echo json_encode($boolResult);
            error_log("[ENCODE false] -> ".$boolResult->result);
        }
    }
    else
    {
            echo json_encode($boolResult);
            error_log("[resetprogression] Can't reset session. Please report to administrator.", 0);
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
        //echo "ScenarioId: ".$scenarioId."\n";
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
        //echo "chapterId: ".$chapterId."\n";
        return $chapterId;
    }

     function GetSessionID($connection, $histId, $scenarId, $chapId)
    {
        // echo "[GetSessionId] -> "."\n";
        // echo "histId: ".$histId."\n";
        // echo "scenarId: ".$scenarId."\n";
        // echo "chapId: ".$chapId."\n";
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
        //echo "sessionId: ".$sessionId."\n";
        return $sessionId;
    }
    
        function ReturnEmptyString() {
        $instance = new ResetModelDown(false);
        echo json_encode($instance);
        exit();
    }

    function GetChapterHumanName($scenarioName, $chapterName)
    {
        //echo "GetRealName\n";
        $filePath = "../StreamingAssets/scenarii/".$scenarioName."/Chapters/".$chapterName;
        //echo $filePath;

        // Read the JSON file 
        $json = file_get_contents($filePath);

        // Decode the JSON file
        $json_data = json_decode($json,true);

        //Get value of key "Title"
        $challengeZero = $json_data[0];
        //print_r($challengeZero); 

        $title = $challengeZero['Title'];
        //echo "---".$title."\n";

        return $title;
    }
    mysqli_close($connection);
?>