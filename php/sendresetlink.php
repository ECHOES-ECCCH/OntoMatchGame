<?php
    session_start();
    include("connect.php");

    header('Content-Type: application/json');

    //Check & log DB connexion
    if (!$connection->ping()) {
        printf ("Error: %s\n", $connection->error);
    }

    //DTO : Data server -> client, create activation code from email
    class ResetModelDown
    {
      public $emailSent;   

      public function __construct($b) 
      {
          $this->emailSent = $b;
      }
    }

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
  
    if ( ( isset($parsed->email) && $parsed->email != '') && (isset($parsed->code) && $parsed->code != '') )
    {
        $email = $parsed->email;
        $activationcode =  $parsed->code;

        //TODO : For production, add "oliviermarlet@gmail.com"
        $recipients = array(
        $email,
        "fx.talgorn@indytion.com"
        );

        $email_to = implode(',', $recipients); // your email address
        $subject = $lang['reset_pwd_email_subject'];
        $txt = $lang['reset_pwd_email_txt'].":\nhttps://ontomatchgame.huma-num.fr/php/reset.php?code=".$activationcode."&lang=".$_SESSION['lang'];
        $headers = "From: noreply@huma-num.fr";

        mail($email_to,$subject,$txt,$headers);

        ReturnResetEmailStatus(true);
    }
    else
    {
            ReturnResetEmailStatus(false);
    }

    function ReturnResetEmailStatus($b) {
        $instance = new ResetModelDown($b);
        echo json_encode($instance);
    }

    mysqli_close($connection);
?>
