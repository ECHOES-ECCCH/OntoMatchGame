<?php
  ini_set('display_errors', 0);
  error_reporting(0);

  session_start();

    include("connect.php");

    header('Content-Type: application/json');

    //Check & log DB connexion
    if (!$connection->ping()) {
        printf ("Error: %s\n", $connection->error);
    }

    //DTOs
    //Data server -> client, create activation code from email
    class SignupModelDown
    {
      public $code;   

      public function __construct($c) 
      {
          $this->code = $c;
      }
    }
    //End DTOs

    $body = file_get_contents('php://input');//Needed because data are json, not from xxx-form-encoded
    $parsed = json_decode($body);


  //*** SET HERE THE RELATIVE PATH TO LANGUAGES FILES ***//
  $relative_languages_folder = "./languages/";

  // Define supported languages
  $available_langs = array('en','fr');
  // Set default language session
  $_SESSION['lang'] = 'en';

    //lang field
    if( isset($parsed->lang) && $parsed->lang != '')
    {
        if(in_array($parsed->lang, $available_langs, true))
        {
          $_SESSION['lang'] = $parsed->lang; // Set language for the session
        }
    }

  //INCLUDE LANGUAGE VARIABLES DEFINED IN LANGUAGE FILE
  include($relative_languages_folder.$_SESSION['lang'].'/lang.'.$_SESSION['lang'].'.php');

    //username field
    if(isset($parsed->username) && $parsed->username != '')
    {
        $username = $parsed->username;
    }
    else
    {
        $username = '';
    }

    //email field
    if(isset($parsed->email) && $parsed->email != '')
    {
        $email = $parsed->email;

        if (!filter_var($email, FILTER_VALIDATE_EMAIL))
        {
            error_log("[OntoMatchGame] Invalid email format. Can't create account.", 0);
            ReturnEmptyString();
            exit("[OntoMatchGame] Invalid email format. Can't create account.");
        }

        $activationcode =  hash("sha256", $email, $binary=false);
    }
    else
    {
        error_log("[OntoMatchGame] Email field empty. Can't create account.", 0);
        ReturnEmptyString();
        exit("[OntoMatchGame] Email field empty. Can't create account.");
    }

    //password field
    if(isset($parsed->password) && $parsed->password != '')
    {
        $password = hash("sha256", $parsed->password, $binary=false);
    }
    else
    {
        error_log("[OntoMatchGame] Password field empty. Can't create account.", 0);
        ReturnEmptyString();
        exit("[OntoMatchGame] Password field empty. Can't create account.");
    }

    //status code, 0 at creation time
    $status = 0;

    //age field
    if(isset($parsed->age) && $parsed->age != '')
    {
        $age =  $parsed->age;
    }
    else
    {
        $age=0;
    }

    //firstname field
    if(isset($parsed->firstname) && $parsed->firstname != '')
    {
        $firstname =  $parsed->firstname;
    }
    else
    {
        $firstname='';
    }

    //lastname field
    if(isset($parsed->lastname) && $parsed->lastname != '')
    {
        $lastname =  $parsed->lastname;
    }
    else
    {
        $lastname='';
    }

    //country field
    if(isset($parsed->country) && $parsed->country != '')
    {
        $country =  $parsed->country;
    }
    else
    {
        error_log("[OntoMatchGame] Country field empty. Can't create account.", 0);
        ReturnEmptyString();
        exit("[OntoMatchGame] Country field empty. Can't create account.");
    }

    //countrycode field
    if(isset($parsed->countryCode) && $parsed->countryCode != '')
    {
        $countryCode =  $parsed->countryCode;
    }
    else
    {
        error_log("[OntoMatchGame] Country field empty. Can't create account.", 0);
        ReturnEmptyString();
        exit("[OntoMatchGame] Country field empty. Can't create account.");
    }

    //optin field
    if(isset($parsed->optin) && $parsed->optin == 'true') //optin is necessarily set (false by default)
    {
        //echo $parsed->optin;
        $optin =  1;

    }
    else
    {
        //echo $parsed->optin;
        $optin =  0;
    }

    //Create UserAccount
    $stmt = $connection->prepare("
        INSERT INTO ontomatchgame.UserAccount
            (username, email, password, activationcode, age, firstname, lastname, country, countryCode, status, optin)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param(
        "ssssissssii",
        $username,
        $email,
        $password,
        $activationcode,
        $age,
        $firstname,
        $lastname,
        $country,
        $countryCode,
        $status,
        $optin
    );

    $add = $stmt->execute();

    if ($add)
    {
        //Create User HistoryID from the id of the row we just inserted
        $userId = $connection->insert_id;
        $stmt = $connection->prepare("INSERT INTO ontomatchgame.History (historyId, userId) VALUES (DEFAULT, ?)");
        $stmt->bind_param("i", $userId);
        $stmt->execute();

        //Send email with activation code
        $recipients = array(
            $email,
            "olivier.marlet@univ-tours.fr"
            );

        $email_to = implode(',', $recipients); // your email address
        $subject = $lang['activate_email_subject'];
        $txt = $lang['activate_email_text'].":\nhttps://ontomatchgame.huma-num.fr/php/verification.php?code=".$activationcode."&lang=".$_SESSION['lang'];
        $headers = "From: noreply@huma-num.fr";

        mail($email_to,$subject,$txt,$headers);

        //Encapsulate as JSON object
        //Only report success/failure to the client, never the activation code itself
        //Echoed last, and nothing below writes to stdout, so the response body stays valid JSON
        $instance = new SignupModelDown(true);
        echo json_encode($instance);
    }
    else
    {
        echo $sqli->error;
        error_log("[OntoMatchGame] Sorry. Database server error. Can't create account. See DB administrator for details.", 0);
        ReturnEmptyString();
        exit("[OntoMatchGame] Sorry. Database server error. Can't create account. See DB administrator for details.");
    }

    function ReturnEmptyString() {
        $instance = new SignupModelDown(false);
        echo json_encode($instance);
    }

    mysqli_close($connection);
?>
