<?php

    include("connect.php");

    if (!$connection->ping()) {
      printf ("Error: %s\n", $connection->error);
    }

    //DTO down, bool result
    class EmailCheck
    {
      public $doesExist;

      public function __construct($b) 
      {
          $this->doesExist = $b;
      }
    }

    //Search for email in DB.UserAccount
    $query = "SELECT * FROM UserAccount WHERE email='".$_GET["email"]."'";    
    $result = $connection->query($query);

    if ($result->num_rows > 0) {//Email found
          $result = new EmailCheck(true);
          echo json_encode($result);
      } else {
        $result = new EmailCheck(false);
        echo json_encode($result);
    } 

    mysqli_close($connection);
?>