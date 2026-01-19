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

    //Get UserId
    $userId = $_GET['userId'];

    //Get historyId
    $historyId = GetHistory($connection, $userId);

    DeleteProgressions($connection, $historyId);

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

    function DeleteProgressions($connection, $historyId)
    {
        //Delete all progressions for this historyId
        $sql = " DELETE Progression FROM ontomatchgame.Progression INNER JOIN ontomatchgame.Session WHERE ontomatchgame.Progression.sessionId = ontomatchgame.Session.sessionId AND ontomatchgame.Session.historyId = '{$historyId}' ";
        $result = mysqli_query($connection, $sql);

        if($result)
        {
            DeleteSessions($connection, $historyId);
        }
    }

    function DeleteSessions($connection, $historyId)
    {
        //Delete all sessions for this historyId
        $sql = " DELETE Session FROM ontomatchgame.Session WHERE ontomatchgame.Session.historyId = '{$historyId}' ";
        $result = mysqli_query($connection, $sql);

        if($result)
        {
            $boolResult = new SessionModelDown(true);
            echo json_encode($boolResult);
        }
        else
        {
            $boolResult = new SessionModelDown(false);
            echo json_encode($boolResult);
        }
    }

    mysqli_close($connection);
?>
