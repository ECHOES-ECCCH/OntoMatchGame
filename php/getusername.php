<?php
    include("connect.php");

    header('Content-Type: application/json');

    if (!$connection->ping()) {
      printf ("Error: %s\n", $connection->error);
    }

    //DTO down, bool result
    class UsernameModelDown
    {
      public $username;

      public function __construct($b) 
      {
          $this->username = $b;
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
                $name = $row["username"];
                $instance = new UsernameModelDown($name);
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
        $instance = new UsernameModelDown('');
        echo json_encode($instance);
    }

    mysqli_close($connection);
?>
