<?php
    include("connect.php");

    header('Content-Type: application/json');

    if (!$connection->ping()) {
      printf ("Error: %s\n", $connection->error);
    }

    //DTO down, bool result
    class ActivationCodeModelDown
    {
      public $code;

      public function __construct($b) 
      {
          $this->code = $b;
      }
    }

    $body = file_get_contents('php://input');//Needed because data are json, not from xxx-form-encoded
    $parsed = json_decode($body);

    //email field
    if(isset($parsed->email) && $parsed->email != '')
    {
        $email = $parsed->email;
    }
    else
    {
        error_log("[OntoMatchGame] Email field empty. Can't create account.", 0);
        exit("[OntoMatchGame] Email field empty. Can't create account.");
    }

    //Search for email in DB.UserAccount
    $query = "SELECT * FROM UserAccount WHERE email='$email'";    

    $result = mysqli_query($connection,$query);
    if ($result)
    {
        if ($result->num_rows > 0)//Email found
        {
            while ($row = mysqli_fetch_array($result))
            { 
                $code = $row["activationcode"];
                $instance = new ActivationCodeModelDown($code);
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
        $instance = new ActivationCodeModelDown('');
        echo json_encode($instance);
    }

    mysqli_close($connection);
?>