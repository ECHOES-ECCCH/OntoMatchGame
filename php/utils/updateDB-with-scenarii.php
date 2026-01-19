<?php
    // Parse scenarii folder to update new scenario entry:
    // For each new Scenario
    //      Update 'scenarioName' in Table 'Scenario' (autoincrement)
    // For each chapter
    //      Update 'scenarioId' et chapterName' in Table 'Chapter'


    include("../connect.php");

    if (!$connection->ping()) {
      printf ("Error: %s\n", $connection->error);
    }

    echo "Con OK.";

    $scenariiFolderPath = "../../StreamingAssets/scenarii/*";

    $sql = "CREATE TABLE IF NOT EXISTS Scenario (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,   scenarioName varchar(50)) ";
    $result = mysqli_query($connection, $sql);
    if ($result) {
        echo "OK. Table Scenario does exist, continue with scan of scenarii folder...";
        $folders = glob($scenariiFolderPath, GLOB_ONLYDIR);
        UpdateTable($connection, $folders);
    } else {
        echo "Error creating table: " . $conn->error;
    }

    function UpdateTable($connection, $folders)
    {
        echo "Updating table...\n";
        foreach ($folders as $folderName)
        {
            $name = basename($folderName);

            //Check if name already exists
            $query = " SELECT * FROM ontomatchgame.Scenario WHERE ontomatchgame.Scenario.scenarioName = '{$name}' ";
            $result = mysqli_query($connection, $query);

            if($result)
            {
                //Name already exists...
                if($result -> num_rows > 0)
                {
                    while ($row = mysqli_fetch_array($result))
                    { 
                        echo "Name ".$row['scenarioName']." already exists\n";
                    }
                }
                //Name is new
                else
                {
                    AddNewScenarioName($connection, $name);
                    AddNewChapterNames($connection, $name);
                    /*
                    //Add chapter names
                    $chapterFolderPath = "/".$name."/Chapters/*";
                    echo "Adding chapters from folder : ".$chapterFolderPath."\n";

                    $query = " INSERT INTO ontomatchgame.Scenario (id, scenarioName) VALUES (DEFAULT, '{$name}') ";
                    $result = mysqli_query($connection, $query);
                    if ($result)
                    {
                        echo "New scenario name added : ".$name."\n";
                    }
                    */
                }
            }

            /*
            $query = " INSERT INTO ontomatchgame.Scenario (id, scenarioName) VALUES (DEFAULT, '{$name}') ";
            $result = mysqli_query($connection, $query);

            if ($result)
            {
                echo "[scanScenario.php] New scenario name added : ".$name."\n";
            }
            */
        }
    }

    function AddNewScenarioName($connection, $name)
    {
        echo "Name ".$name." is new ! insert it...\n";
        $query = " INSERT INTO ontomatchgame.Scenario (scenarioId, scenarioName) VALUES (DEFAULT, '{$name}') ";
        $result = mysqli_query($connection, $query);
        if ($result)
        {
            echo "New scenario name added : ".$name."\n";
        }
    }

    function AddNewChapterNames($connection, $name)
    {
        //Add chapter names
        $chaptersFolderPath = "../../StreamingAssets/scenarii/".$name."/Chapters/*";
        echo "Adding chapters from : ".$chaptersFolderPath;
        // $chapters = scandir($chaptersFolderPath);
        // print_r($chapters);

        $chapters = glob($chaptersFolderPath.'{json}', GLOB_BRACE);
        if(count($chapters) > 0)
        {
            //Get scenarioId
            $sql = " SELECT * FROM ontomatchgame.Scenario WHERE ontomatchgame.Scenario.scenarioName = '{$name}'";
            $result = mysqli_query($connection, $sql);
            if($result)
            {
                if($result -> num_rows > 0)
                {
                    while ($row = mysqli_fetch_array($result))
                    { 
                        echo "ScenarioId is : ".$row['scenarioId'];
                        $scenarioId = $row['scenarioId'];
                    }
                }
            }

            //insert chapterName
            foreach ($chapters as $fileName)
            {
                $shortName = basename($fileName);

                $query = " INSERT INTO ontomatchgame.Chapter (chapterId, scenarioId, chapterName) VALUES (DEFAULT, '{$scenarioId}', '{$shortName}') ";
                $result = mysqli_query($connection, $query);
                if ($result)
                {
                    echo "ChapterName added = ".$shortName."\n";
                }
            }

        }
    }

    mysqli_close($connection);
?>
