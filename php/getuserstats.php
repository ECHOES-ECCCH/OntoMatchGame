<?php
    include("connect.php");
    header('Content-Type: application/json');

    if (!$connection->ping()) {
      printf ("Error: %s\n", $connection->error);
    }

    //Temps class to store fetched ids from tables
    class UserScenarioStat
    {
        public $userId;
        public $scenarioName;
        public $scenarioLanguage;
        public $chapterName;
        public $lastChallengeId;
        public $maxChallengeCount;
        public $score;
        public $maxPossibleScore;

         public function __construct($userId, $scenarioName, $scenarioLanguage, $chapterName, $lastChallengeId, $maxChallengeCount, $score, $maxPossibleScore) 
        {
            $this->userId = $userId;
            $this->scenarioName = $scenarioName;
            $this->scenarioLanguage = $scenarioLanguage;
            $this->chapterName = $chapterName;
            $this->lastChallengeId = $lastChallengeId;
            $this->maxChallengeCount = $maxChallengeCount;
            $this->score = $score;
            $this->maxPossibleScore = $maxPossibleScore;
        }
    }

    //Final list to upload : A list of ProgressionModelDown class
    $UserProgression = array();

    //Get UserId
    $userId = $_GET['userId'];

    //Get historyID of this user
    $historyId = GetHistory($connection, $userId);

    //Get all progressions data (ids)
    $progressionIds = GetProgressionIds($connection, $historyId, $userId);

    echo json_encode($progressionIds);

    function GetProgressionIds($connection, $historyId, $userId)
    {
        $progressions = array();

        $sql = " SELECT Session.scenarioId, Session.lastChapterId, Progression.lastChallengeId, Progression.score FROM ontomatchgame.Progression INNER JOIN ontomatchgame.Session WHERE ontomatchgame.Progression.sessionId = ontomatchgame.Session.sessionId AND ontomatchgame.Session.historyId = '$historyId' ";

        $result = mysqli_query($connection, $sql);

        if($result)
        {
            if($result -> num_rows > 0)
            {
                while($row = mysqli_fetch_array($result))
                {
                    $scenarId = $row['scenarioId'];
                    $sname = GetScenarioName($connection, $scenarId);

                    $lastChapterId = $row['lastChapterId'];

                    $chapterFileName = GetChapterFileName($connection, $scenarId, $lastChapterId);
                    
                    $scenarioLanguage = GetScenarioLanguage($connection, $sname);

                    $chapterName="";
                    $maxChallengeCount = 0;
                    $maxPossibleScore = 0;

                    GetChapterData($connection, $lastChapterId, $sname, $chapterName, $maxChallengeCount, $maxPossibleScore);

                    $lastChallengeId = $row['lastChallengeId'];

                    $score = $row['score'];

                    $pIds = new UserScenarioStat($userId, $sname, $scenarioLanguage, $chapterName, $lastChallengeId, $maxChallengeCount, $score, $maxPossibleScore);
                    array_push($progressions, $pIds);   
                }
            }
            else
            {
                $pIds = new UserScenarioStat(-1, "", "", "", -1, -1, -1, -1);
                array_push($progressions, $pIds); 
            }
        }
        return $progressions;    
    }

    function GetHistory($connection, $userId)
    {
        $sql = "SELECT * FROM ontomatchgame.History WHERE ontomatchgame.History.userId = '{$userId}'";
        $result = mysqli_query($connection, $sql);

        if($result)
        {
            if($result -> num_rows > 0)
            {
                while($row = mysqli_fetch_array($result))
                {
                    $historyId = $row['historyId'];
                }
                return $historyId;
            }
        }
        else
        {
            return null;
        }
    }

    function GetScenarioName($connection, $scenarioId)
    {
        $query = "SELECT Scenario.scenarioName FROM Scenario WHERE Scenario.scenarioId = $scenarioId ";
        $result = mysqli_query($connection,$query);

        if ($result)
        {
            if ($result->num_rows > 0)
            {
                while ($row = mysqli_fetch_array($result))
                { 
                    $scenarioName = $row["scenarioName"];
                }
                return $scenarioName;
            }
            else
            {
                error_log("[getprogressions.php] Could not fetch Scenario Name from ScenarioId.", 0);
            }
        }
        else
        {
            return null;
        }
    }

    function GetChapterFileName($connection, $scenarioId, $chapterId)
    {
        $query = "SELECT Chapter.chapterName FROM Chapter WHERE Chapter.scenarioId = $scenarioId AND Chapter.chapterId = $chapterId ";
        $result = mysqli_query($connection,$query);

        if ($result)
        {
            if ($result->num_rows > 0)
            {
                while ($row = mysqli_fetch_array($result))
                { 
                    $chapterFileName = $row["chapterName"];
                }
                return $chapterName;
            }
            else
            {
                error_log("[getprogressions.php] Could not fetch Chapter Name from chapterId.", 0);
            }
        }
        else
        {
            return null;
        }
    }

    function GetScenarioLanguage($connection, $scenarioName)
    {
            //Generate file path from scenarioName
            $filePath = "../StreamingAssets/scenarii/".$scenarioName."/".$scenarioName.".json";

            $string = file_get_contents($filePath);
            $json_a = json_decode($string, true);

            $language = $json_a['languageTag'];
            return $language;
    }

    function GetChapterData($connection, $chapterId, $scenarioName, &$chapterName, &$maxChallengeCount, &$maxPossibleScore)
    {
        $query = "SELECT Chapter.chapterName FROM Chapter WHERE Chapter.chapterId = $chapterId ";
        $result = mysqli_query($connection,$query);

        if ($result)
        {
            if ($result->num_rows > 0)
            {
                while ($row = mysqli_fetch_array($result))
                { 
                    $chapterFileName = $row["chapterName"];
                }
            }
            else
            {
                return null;
            }
            //Generate file path from chapterName
            $filePath = "../StreamingAssets/scenarii/".$scenarioName."/Chapters/".$chapterFileName;
            $string = file_get_contents($filePath);
            $json_a = json_decode($string, true);

            //Fetch data
            $chapterName = $json_a[0]['Title'];
            $maxChallengeCount = count($json_a) - 1;

            $sum = 0;
            foreach ( $json_a as $score )
            {
                $sum += $score['Score'];
            }

            $maxPossibleScore = $sum;
        }
    }
    
    mysqli_close($connection); 
?>






