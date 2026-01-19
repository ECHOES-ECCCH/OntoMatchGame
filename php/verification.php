<?php
session_start();
include ("connect.php");

//*** SET HERE THE RELATIVE PATH TO LANGUAGES FILES ***//
  $relative_languages_folder = "./languages/";

  // Define supported languages
  $available_langs = array('en','fr');
  // Set default language session
  $_SESSION['lang'] = 'en';

  if(isset($_GET['lang']) && $_GET['lang'] != '')
  { 
    // check if the language is one we support
    if(in_array($_GET['lang'], $available_langs, true))
    {
      $_SESSION['lang'] = $_GET['lang']; // Set session
    }
  }
  //INCLUDE LANGUAGE VARIABLES DEFINED IN LANGUAGE FILES
  include($relative_languages_folder.$_SESSION['lang'].'/lang.'.$_SESSION['lang'].'.php');

if (!empty($_GET['code']) && isset($_GET['code']))
{
    $code = $_GET['code'];
    $sql = mysqli_query($connection, "SELECT * FROM UserAccount WHERE activationcode='$code'");
    $num = mysqli_fetch_array($sql);
    if ($num > 0)
    {

        $st = 0;
        $result = mysqli_query($connection, "SELECT userId FROM UserAccount WHERE activationcode='$code' and status='$st'");
        $result4 = mysqli_fetch_array($result);
        if ($result4 > 0)
        {
            $st = 1;
            $result1 = mysqli_query($connection, "UPDATE UserAccount SET status='$st' WHERE activationcode='$code'");
            $msg = "<H1>".$lang['message_account_activated']."<br>".$lang['message_login_invite']."<br><br><a href='https://ontomatchgame.huma-num.fr'>OntoMatchGame Home Page</a></H1>";
        }
        else
        {
            $msg = "<H1>Your account is already active, no need to activate again</H1>";
        }
    }
    else
    {
        $msg = "<H1>[ERROR] Activation code is not valid. Could not create account.</H1>";
    }
    echo $msg;
}
else
{
    echo "<H1>[Error] Could not create account (Activation code is not valid).</H1>";
}

mysqli_close($connection);
?>
