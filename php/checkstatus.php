<?php
  include("connect.php");

  //Check & log DB connexion
  if (!$connection->ping()) {
    printf ("Error: %s\n", $connection->error);
  }

  //DTO down, bool result
  class StatusCheck
  {
    public $isActive;

    public function __construct($b) 
    {
        $this->isActive = $b;
    }
  }

  //Search for email / password in DB.UserAccount
  $query = "SELECT * from ontomatchgame.UserAccount WHERE email='".$_GET["email"]."'";

  $result = $connection->query($query);



  if ($result->num_rows > 0)
  {
    //Email found
    //Check status
    while ($row = mysqli_fetch_array($result))
    { 
      $status = $row["status"];

      if($status != '0')
      {
        $instance = new StatusCheck(true);
        echo json_encode($instance);
      }
      else
      {
        $instance = new StatusCheck(false);
        echo json_encode($instance);
      }

    }
  }
  else
  {
        $instance = new StatusCheck(false);
        echo json_encode($instance);
  }


  mysqli_close($connection);  
?>
