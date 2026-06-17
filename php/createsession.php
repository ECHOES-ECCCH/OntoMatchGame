<?php
    include("connect.php");
    include("auth.php");

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

    //Derive UserId from the authenticated session, never from the client
    $userId = requireAuth();

    //ScenarioTitle field
    if(isset($parsed->scenarioTitle))
    {
        $scenarioTitle = $parsed->scenarioTitle;
    }
    else
    {
        error_log("[createsession.php] scenarioTitle field empty. Can't create session.", 0);
        exit("[createsession.php] scenarioTitle field empty. Can't create session.");
    }

    //ChapterTitle field
    if(isset($parsed->chapterTitle))
    {
        $chapterTitle = $parsed->chapterTitle;
    }
    else
    {
        error_log("[createsession.php] chapterTitle field empty. Can't create session.", 0);
        exit("[createsession.php] chapterTitle field empty. Can't create session.");
    }

    //Fetch historyId in DB.History
    $stmt = $connection->prepare("SELECT historyId FROM ontomatchgame.History WHERE userId = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result)
    {
        if ($result->num_rows > 0)//Email found
        {
            $row = $result->fetch_assoc();
            $historyId = $row['historyId'];
        }
        else
        {
            CreationFailed();
        }
    }
    else
    {
        error_log("[createsession.php] Error : PB while querying ontomatchgame.HistoryId. Please contact administrator.", 0);
        exit("[createsession.php] Error : PB while querying ontomatchgame.HistoryId. Please contact administrator.");
    }

    //Fetch scenarioID and chapterID
    $scenarioId = GetScenarioID($connection, $scenarioTitle);
    $chapterId = GetChapterID($connection, $scenarioId, $chapterTitle);
    
    //Create Session from historyID, scenarioTitle, chapterTitle
    $query = " INSERT INTO ontomatchgame.Session (sessionId, historyId, scenarioId, lastChapterId) VALUES (DEFAULT, $historyId, $scenarioId, $chapterId) ";
    $result = mysqli_query($connection,$query);

    if (!$result)
    {
        error_log("[createsession.php] Error : PB while creating session. Please contact administrator.", 0);
        exit("[createsession.php] Error : PB while creating session. Please contact administrator.");
    }

    //Create a default Progression (challengeIndex = 1, Score = 0) for this session
    $sessionId = GetSessionID($connection, $historyId, $scenarioId, $chapterId);

    $query = " INSERT INTO ontomatchgame.Progression (progressionId, sessionId, chapterId, lastChallengeId, score) VALUES
    (   DEFAULT,
        $sessionId,
        $chapterId,
        1,
        0
    ) ";

    $result = mysqli_query($connection, $query);

    if ($result)
    {
        $boolResult = new SessionModelDown(true);
        echo json_encode($boolResult);
    }
    else
    {
        $boolResult = new SessionModelDown(false);
        echo json_encode($boolResult);
        error_log("[createsession.php] Error : Error while INSERT new session.", 0);
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

    function CreationFailed()
    {
        $session = new SessionModelDown(false);
        echo json_encode($session);
    }

    mysqli_close($connection);
?>