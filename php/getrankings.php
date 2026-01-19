<?php
    include("connect.php");
    header('Content-Type: application/json');

    if (!$connection->ping()) {
      printf ("Error: %s\n", $connection->error);
    }

    $maxScores = 15;//Max nb of players / scenario displayed
    $catalogFileName = "scenariiCatalog.json";

    class PlayerData {
     public $username; //String
     public $score; //String
    }

    class Scenario {
     public $scenarioName; //String
     public $maximumScore; //String
     public $playerData; //array( PlayerData )
    }

    class Scenarii {
     public $scenario; //array( Scenario )
    }

    class Languages {
     public $languageName; //String
    public $scenarii; //Scenarii
    }

    class Leaderboard {
     public $languages; //array( Languages )
    }

    //************* Get distinct languages in scenariiCatalog.json **************
    $langs = array();//List of languageTags found in scenarii

    $filePath = "../StreamingAssets/scenarii/".$catalogFileName;
    $string = file_get_contents($filePath);
    $json_a = json_decode($string, true);// $json_a as object, not associative array

    foreach ($json_a['scenarii'] as $each) {
        if (!in_array($each['languageTag'], $langs))
        {
            array_push($langs, $each['languageTag']);
        }
    }

    //************* Get scenarii titles  in scenariiCatalog.json **************
    $scenarioTitleList = array();

    foreach ($json_a['scenarii'] as $each) {
        if(strcasecmp($each['scenario-title'], "YOUR GAME HERE!") != 0)
        {
            array_push($scenarioTitleList, $each['scenario-title']);            
        }
    }

    //LEADERBOARD OBJECT TO BE RETURNED
    $leaderBoard = new Leaderboard();

    //LEADERBOARD->$LANGUAGES
    $languages = array();
    $leaderBoard->languages = $languages; 

    foreach ($langs as $language) {
        //LANGUAGES->$LANGUAGENAME
        $languageItem = new Languages();
        $languageItem->languageName = $language;
        array_push($leaderBoard->languages, $languageItem);

        //LANGUAGES->$SCENARII
        $scenarii = new Scenarii();
        $scenarioArray = array();
        $playerData = array();

        //SCENARIO LOOP : Fetch MaxScenarioScore and PlayerData
        foreach($json_a['scenarii'] as $scenario)
        {
            if(strcasecmp($scenario['scenario-title'], "YOUR GAME HERE!") != 0)
            {
                if(strcasecmp($language, $scenario['languageTag']) == 0)
                {
                    $scenarioItem = new Scenario();
                    $scenarioItem->scenarioName = $scenario['scenario-title'];
                    $scenarioItem->maximumScore = GetMaximumScore($connection, $catalogFileName, $scenario['scenario-title']);

                    GetPlayerData($connection, $scenario['scenario-title'], $playerData);
                    $scenarioItem->playerData = $playerData;
                    array_push($scenarioArray, $scenarioItem);
                }
            }
        }
        
        $scenarii->scenario = $scenarioArray;
        $languageItem->scenarii = $scenarii;
    }

    echo json_encode($leaderBoard);


    //____________________________________________________________________________
    // ________________________________ FUNCS ___________________________________
    //____________________________________________________________________________
    function GetMaximumScore($connection, $catalogFileName, $scenarioName)
    {
        $listOfChapterFileNames = GetChapterFilesNames($catalogFileName, $scenarioName);

        foreach($listOfChapterFileNames as $chapterFileName)
        {
            $filePath = "../StreamingAssets/scenarii/".$scenarioName."/Chapters/".$chapterFileName;
            $string = file_get_contents($filePath);
            $json_a = json_decode($string, true);

            $sum = 0;
            foreach ( $json_a as $score )
            {
                $sum += $score['Score'];
            }
            $totalSum += $sum;
        }
        return $totalSum;
    }

    function GetPlayerData($connection, $scenarioName, &$playerDataArray)
    {
        $scenarioId = GetScenarioId($connection, $scenarioName);
        $historyIdsFromScenarioId = GetHistoryIdsFromScenarioId($connection, $scenarioId);
        $listOfUniqueHistoryIds = array_unique($historyIdsFromScenarioId);

        //Get sessions of each historyIds
        foreach($listOfUniqueHistoryIds as $historyId)
        {
            $playerData = New PlayerData();

            $username = GetUserName($connection, $historyId);

            $userScore = GetUserScore($connection, $historyId, $scenarioId);

            $playerData->username = $username;
            $playerData->score = $userScore;

            array_push($playerDataArray, $playerData);
        }
    }

    function GetChapterFilesNames($catalogFileName, $scenarioName)
    {
        $chapterFileNames = array();//List of chapter names

        $catalogFilePath = "../StreamingAssets/scenarii/".$catalogFileName;

        $string = file_get_contents($catalogFilePath);
        $json_a = json_decode($string, true);// $json_a as associative array

        $arrayOfScenarii = $json_a['scenarii'];
        foreach($arrayOfScenarii as $scenario)
        {
            if(strcasecmp($scenario['scenario-title'], $scenarioName) == 0)
            {
                foreach ($scenario['chapters'] as $chapters)
                {
                    array_push($chapterFileNames, $chapters['chapter-filename']);
                }
            }
        }
       return$chapterFileNames;
}

    function GetScenarioId($connection, $scenarioName)
    {
        $sql = " SELECT * FROM ontomatchgame.Scenario  WHERE ontomatchgame.Scenario.scenarioName = '{$scenarioName}'";
        $result = mysqli_query($connection,$sql);

        if ($result)
        {
            if ($result->num_rows > 0)
            {
                while ($row = mysqli_fetch_array($result))
                { 
                    $scenarioId = $row["scenarioId"];
                }
            }
            else
            {
                $scenarioId = null;
            }
        }
        return $scenarioId;
    }

    function GetHistoryIdsFromScenarioId($connection, $scenarioId)
    {
        $listOfHistoryIds = array();

        $sql = " SELECT ontomatchgame.Session.historyId FROM ontomatchgame.Session  WHERE ontomatchgame.Session.scenarioId = '{$scenarioId}' ";
        $result = mysqli_query($connection,$sql);

        if ($result)
        {
            if ($result->num_rows > 0)
            {
                while ($row = mysqli_fetch_array($result))
                { 
                    array_push($listOfHistoryIds, $row['historyId']);
                }
            }
            else
            {
                $scenarioId = null;
            }
        }
        return $listOfHistoryIds;
    }

    function GetUserName($connection, $historyId)
    {
        $sql = " SELECT ontomatchgame.History.userId FROM ontomatchgame.History  WHERE ontomatchgame.History.historyId = '{$historyId}' ";
        $result = mysqli_query($connection,$sql);

        if ($result)
        {
            if ($result->num_rows > 0)
            {
                while ($row = mysqli_fetch_array($result))
                { 
                    $userId = $row['userId'];
                }
            }
            else
            {
                $userId = null;
            }
        }

        if($userId != null)
        {
            $username = GetNameFromId($connection, $userId);
        }
        else
        {
            $username = null;
        }

        return $username;
    }

    function GetNameFromId($connection, $userId)
    {
        $sql = " SELECT ontomatchgame.UserAccount.username FROM ontomatchgame.UserAccount  WHERE ontomatchgame.UserAccount.userId = '{$userId}' ";
        $result = mysqli_query($connection,$sql);

        if ($result)
        {
            if ($result->num_rows > 0)
            {
                while ($row = mysqli_fetch_array($result))
                { 
                    $username = $row['username'];
                }
            }
            else
            {
                $username = null;
            }
        }
        return $username;
    }

    function GetUserScore($connection, $historyId, $scenarioId)
    {
        $userScore = 0;

        $sql = " SELECT Progression.score FROM ontomatchgame.Progression INNER JOIN ontomatchgame.Session WHERE ontomatchgame.Progression.sessionId = ontomatchgame.Session.sessionId AND ontomatchgame.Session.historyId = '$historyId' AND ontomatchgame.Session.scenarioId = '$scenarioId' ";
        $result = mysqli_query($connection, $sql);

        if ($result)
        {
            if ($result->num_rows > 0)
            {
                while ($row = mysqli_fetch_array($result))
                { 
                    $score = $row['score'];
                    $userScore += $score;
                }
            }
            else
            {
                $userScore = null;
            }
        }
        return $userScore;
    }




    mysqli_close($connection); 
?>