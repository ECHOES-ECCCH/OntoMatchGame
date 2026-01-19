<?php
    include("connect.php");

    header('Content-Type: application/json');

    if (!$connection->ping()) {
      printf ("Error: %s\n", $connection->error);
    }

    //DTO down, bool result
    class SessionModelDown
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
        error_log("[OntoMatchGame] UserId field empty. Can't update session.", 0);
        exit("[OntoMatchGame] UserId field empty. Can't update session.");
    }
    //echo "User ID->".$userId."\n\n";

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
    //echo "scenarioTitle->".$scenarioTitle."\n";
    //echo "ONE -> Scenario Title is : ".$scenarioTitle."\n";

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
    //echo "chapterTitle->".$chapterTitle."\n";
    //echo "[TWO] Scenario Title is : ".$scenarioTitle."\n";
    //ChallengeIndex field
    if(isset($parsed->currentChallengeIndex))
    {
        $currentChallengeIndex = $parsed->currentChallengeIndex;
    }
    else
    {
        error_log("[OntoMatchGame] currentChallengeIndex field empty. Can't update session.", 0);
        exit("[OntoMatchGame] currentChallengeIndex field empty. Can't update session.");
    }
    //echo "Challenge index->".$currentChallengeIndex;

    //Score field
    if(isset($parsed->currentScore))
    {
        $score = $parsed->currentScore;
    }
    else
    {
        error_log("[OntoMatchGame] currentScore field empty. Can't update session.", 0);
        exit("[OntoMatchGame] currentScore field empty. Can't update session.");
    }
    //echo "Score->".$score;

    //TODO
    // + Fetch history ID from UserID
    //+Fetch scenarioID and ChapterId from Names
    //+Fetch sessionID from scenario and chapter IDs
    //+Fetch Progression from sessionId and Chapter ID
    //+Update progression with challengeIndex and score


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
        //echo "[Create Session] PB while querying HistoryId. Please contact administrator.";
    }

    //echo "[Before] Scenario Title is : ".$scenarioTitle."\n";

    //Get scenarioID and chapterID
    $title = $scenarioTitle;
    $scenarioId = GetScenarioID($connection, $title);
    //echo "**********************\n";
    //echo "Scenario Title is : ".$scenarioTitle."\n";
    //echo "Scenario ID is : ".$scenarioId;
    //echo "\n";
    //echo "**********************\n";

    //Get chapterID
    $chapterId = GetChapterID($connection, $scenarioId, $chapterTitle);
    //echo "chapterId ID is : ".$chapterId;

    //Fetch Session from historyID, sceanrioTitle, chapterTitle
    //echo "his-sce-cha->".$historyId." / ".$scenarioId." / ".$chapterId;

    $sessionId = GetSessionID($connection, $historyId, $scenarioId, $chapterId);
    //echo "Session Id = ".$sessionId;

    //Update creation_date of session for it being the last played.
    $query = " UPDATE  ontomatchgame.Session SET creation_date = now() WHERE ontomatchgame.Session.sessionId  = $sessionId ";
    $result = mysqli_query($connection,$query);
    if($result)
    {
        if($result -> num_rows > 0)
        {
            while($row = mysqli_fetch_array($result))
            {
                $progressionId = $row['progressionId'];
            }
        }
        else
        {
            $progressionId = -1;
        }
    }


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
                    //echo "Prog = ".$progressionId;
                }
            }
            else
            {
                $progressionId = -1;
            }
        }
    }

    //UPdate progression with challengeIndex and Score

    //echo "Before update , sessionId->".$sessionId;
    //echo "Before update , chapterId->".$chapterId;

    /*
    UPDATE table_name SET column_name1= value1, column_name2= value2
WHERE condition;
*/

    $query = " UPDATE ontomatchgame.Progression SET sessionId=$sessionId, chapterId=$chapterId, lastChallengeId=$currentChallengeIndex, score=$score WHERE progressionId='{$progressionId}' AND sessionId='{$sessionId}' AND chapterId='{$chapterId}' ";

    $result = mysqli_query($connection, $query);

    if ($result)
    {
        $boolResult = new SessionModelDown(true);
        echo json_encode($boolResult);
        error_log(" [ENCODE true]".$boolResult->result);
    }
    else
    {
        $boolResult = new SessionModelDown(false);
        echo json_encode($boolResult);
        error_log("[ENCODE false] -> ".$boolResult->result);
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
                        //echo "Got chapterId->".$chapterId;
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
    
    mysqli_close($connection);
?>