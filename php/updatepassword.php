<?php
    session_start();

    include("connect.php");

    header('Content-Type: application/x-www-form-urlencoded');

    if (!$connection->ping()) {
      printf ("Error: %s\n", $connection->error);
    }

    /* LANGUAGE LOCALIZATION */
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

    //INCLUDE LANGUAGE VARIABLES DEFINED IN LANGUAGE FILE
    include($relative_languages_folder.$_SESSION['lang'].'/lang.'.$_SESSION['lang'].'.php');

    if (isset($_POST['code']) && !empty($_POST['code'])) {
      $code = $_POST['code'];
    }
    else
    {
      echo $lang['password_updated_KO'];
      echo'<br>';
      echo $lang['contact_administrator'];
      exit("");
    }

    //Set new
    $password = $_POST['password'];
    $password=hash("sha256", $password, $binary=false);

    $query = "UPDATE UserAccount SET password = '$password' WHERE activationcode = '$code'";
    $add = mysqli_query($connection, $query);
 
    if ($add)
    {
      //Build confirmation message and link to OntoMatchGame page.
      echo $lang['password_updated_OK'];
      echo '<br>';
      echo $lang['message_link_to_game'];
      echo <<<HTML
        <html>
        <body> <a href="https://ontomatchgame.huma-num.fr">OntoMatchGame</a> 
        </body>
        </html>
      HTML;
    }
    else
    {
      echo $lang['password_updated_KO'];
      echo'<br>';
      echo $lang['contact_administrator'];
      exit("");
    }
    
    mysqli_close($connection);
?>


