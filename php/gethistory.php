<?php

    include("connect.php");
    header('Content-Type: application/json');

    if (!$connection->ping()) {
      printf ("Error: %s\n", $connection->error);
    }

    //DTO down, bool result
    class historyModelDown
    {
      public $historyId;
      public $scenarioName;
      public $chapterName;
      public $challengeId;
      public $score;    
      public function __construct($id, $scenarioName, $chapterName, $challengeId, $score) 
      {
            $this->historyId = $id;
            $this->scenarioName = $scenarioName;
            $this->chapterName = $chapterName;         
            $this->challengeId = $challengeId;
            $this->score = $score;
      }
    }


    $userId = $_GET['userId'];
    //echo "userId=>".$userId."\n";

    //Get historyId from userId
    $query = " SELECT History.historyId FROM History WHERE History.userId = '{$userId}' ";
    $result = mysqli_query($connection,$query);

    if ($result)
    {
        //echo "RESULT";

        if ( $result -> num_rows > 0)
        {
            //echo "NUM_ROWS";
            while ($row = mysqli_fetch_array($result))
            { 
                $id = $row["historyId"];
                //echo "historyId->".$id;
            }
        }
        else
        {
            ReturnEmptyString();
        }
    }
    else
    {
        //echo "PB with query";
    }

    /* Get most recent sessionId from historyId */
    /*TODO : For all sessions, get list of progression */
    // ORDER BY creation_date DESC LIMIT 1
    $query = " SELECT Session.sessionId  FROM ontomatchgame.Session WHERE Session.historyId = '{$id}' ORDER BY creation_date DESC LIMIT 1";
    $result = mysqli_query($connection, $query);

    if ($result)
    {
        if ($result->num_rows > 0)
        {
            while ($row = mysqli_fetch_array($result))
            { 
                $sessionId = $row["sessionId"];
                //echo "Last sessionId->".$sessionId;
            }
        }
        else
        {
            ReturnEmptyString();
        }
    }
    else
    {
        //echo "PB with query";
    }

    /* Get session data from lastSessionId */
    $query = "SELECT Session.scenarioId, Session.lastChapterId FROM Session WHERE Session.sessionId = $sessionId";
    $result = mysqli_query($connection,$query);

    if ($result)
    {
        if($result -> num_rows > 0)
        {
            while ($row = mysqli_fetch_array($result))
            { 
                $scenarioId = $row["scenarioId"];
                $lastChapterId = $row["lastChapterId"];
                //echo "scenarioId".$scenarioId;
                //echo "lastChapterId".$lastChapterId;
            }
        }
        else
        {
            ReturnEmptyString();
        }
    }
    else
    {
        //echo "PB with query";
    }

    /* Get scenarioName from scenarioId */
    $query = "SELECT Scenario.scenarioName FROM Scenario WHERE Scenario.scenarioId = $scenarioId";
    $result = mysqli_query($connection,$query);

    if ($result)
    {
        if ($result->num_rows > 0)
        {
            while ($row = mysqli_fetch_array($result))
            { 
                $scenarioName = $row["scenarioName"];
                //echo json_encode("scenario Name: ".$scenarioName);echo " --- ";
            }
        }
        else
        {
            ReturnEmptyString();
        }
    }
    else
    {
        //echo "PB with query";
    }

    /* Get chapterName from chapterId */
    $query = " SELECT Chapter.chapterName FROM Chapter WHERE Chapter.chapterId = $lastChapterId ";
    $result = mysqli_query($connection,$query);

    if ($result)
    {
        if ($result->num_rows > 0)
        {
            while ($row = mysqli_fetch_array($result))
            { 
                $chapterName = $row["chapterName"];
               //echo "chapterName :".$chapterName;
            }
        }
        else
        {
            //echo "caca janvier";
            ReturnEmptyString();
        }
    }
    else
    {
        //echo "PB with query";
    }

    /* Get progressionId from lastSessionId */
    $query = "SELECT Progression.progressionId FROM Progression WHERE Progression.sessionId = $sessionId";
    $result = mysqli_query($connection,$query);

    if ($result)
    {
        if ($result->num_rows > 0)
        {
            while ($row = mysqli_fetch_array($result))
            { 
                $progressionId = $row["progressionId"];
                //echo json_encode("ProgressionId = ".$score);echo " --- ";
            }
        }
        else
        {
            ReturnEmptyString();
        }
    }
    else
    {
        //echo "PB with query";
    }

    /* Get progression data from lastSessionId */
    $query = "SELECT Progression.lastChallengeId, Progression.score FROM Progression WHERE Progression.progressionId = $progressionId";
    $result = mysqli_query($connection,$query);

    if ($result)
    {
        if ($result->num_rows > 0)
        {
            while ($row = mysqli_fetch_array($result))
            { 
                $lastChallengeId = $row["lastChallengeId"];
                $score = $row["score"];
                //echo "lastChallengeId".$lastChallengeId;
                //echo "score".$score;
            }
        }
        else
        {
            ReturnEmptyString();
        }
    }
    else
    {
        //echo "PB with query";
    }

    $realName = GetChapterHumanName($scenarioName, $chapterName);


    $instance = new historyModelDown($id, $scenarioName, $realName, $lastChallengeId, $score);
    echo json_encode($instance);

    mysqli_close($connection);

    function ReturnEmptyString() {
        $instance = new historyModelDown("", "", "", "", "");
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
?>

