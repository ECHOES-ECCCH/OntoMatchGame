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

    //Derive UserId from the authenticated session, never from the client
    $userId = requireAuth();

    //Get historyId
    $historyId = GetHistory($connection, $userId);

    DeleteProgressions($connection, $historyId);

    function GetHistory($connection, $userId)
    {
        $stmt = $connection->prepare("SELECT historyId FROM ontomatchgame.History WHERE userId = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        if($result && $result->num_rows > 0)
        {
            $row = $result->fetch_assoc();
            return $row['historyId'];
        }

        return null;
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
