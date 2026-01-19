<?php

    include("connect.php");

    if (!$connection->ping()) {
      printf ("Error: %s\n", $connection->error);
    }

    //DTO down, bool result
    class UsernameCheck
    {
      public $doesExist;

      public function __construct($b) 
      {
          $this->doesExist = $b;
      }
    }

    //Search for email in DB.UserAccount
    $query = "SELECT * FROM UserAccount WHERE username='".$_GET["username"]."'";    
    $result = $connection->query($query);

    if ($result->num_rows > 0) {//Email found
          $result = new UsernameCheck(true);
          echo json_encode($result);
      } else {
        $result = new UsernameCheck(false);
        echo json_encode($result);
    } 

    mysqli_close($connection);
?>