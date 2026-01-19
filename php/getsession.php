<?php
    class DoesExists
    {
      public $doesExist;

      public function __construct($b) 
      {
          $this->doesExist = $b;
      }
    }
    $result = new DoesExists(true);
    echo json_encode($result);
    
/*
    include("connect.php");

    if (!$connection->ping()) {
      printf ("Error: %s\n", $connection->error);
    }

    //DTO down, bool result
    class DoesExists
    {
      public $doesExist;

      public function __construct($b) 
      {
          $this->doesExist = $b;
      }
    }

    //Get Id of scenario and chapter



    //Search for email in DB.UserAccount
    $query = "SELECT * FROM Session WHERE scenarioId='".$_GET["email"]."'";    
    $result = $connection->query($query);

    if ($result->num_rows > 0) {//Email found
          $result = new DoesExists(true);
          echo json_encode($result);
      } else {
        $result = new DoesExists(false);
        echo json_encode($result);
    } 

    mysqli_close($connection);
    */
?>