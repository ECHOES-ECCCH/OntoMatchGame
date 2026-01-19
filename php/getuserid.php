<?php
    include("connect.php");

    header('Content-Type: application/json');

    if (!$connection->ping()) {
      printf ("Error: %s\n", $connection->error);
    }

    //DTO down, bool result
    class userIdModelDown
    {
      public $userId;

      public function __construct($b) 
      {
          $this->userId = $b;
      }
    }

    //Search for email in DB.UserAccount
    $query = "SELECT * FROM UserAccount WHERE email='".$_GET["email"]."'";

    $result = mysqli_query($connection,$query);
    if ($result)
    {
        if ($result->num_rows > 0)//Email found
        {
            while ($row = mysqli_fetch_array($result))
            { 
                $name = $row["userId"];
                $instance = new userIdModelDown($name);
                echo json_encode($instance);
            }
        }
        else
        {
            ReturnEmptyString();
        }
    }
    else
    {
        echo "PB with query";
    }

    function ReturnEmptyString() {
        $instance = new userIdModelDown('');
        echo json_encode($instance);
    }

    mysqli_close($connection);
?>
