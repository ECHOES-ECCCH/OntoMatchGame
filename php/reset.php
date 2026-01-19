<!--PHP-->
<!--Load and set language variables-->
<!--languages dictionnary located at [website_root_folder]/languages/...-->
<?php
  session_start();

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
  //INCLUDE LANGUAGE VARIABLES DEFINED IN LANGUAGE FILE
  include($relative_languages_folder.$_SESSION['lang'].'/lang.'.$_SESSION['lang'].'.php');
?>

<!--HTML------------------------------------------------------------------------------------------------------------->
<html>
  <head>

  <!--STYLE------------------------------------------------------------------------------------------------------------->
    <style>
    /* Style all input fields */
    input {
      width: 70%;
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
      margin-top: 6px;
      margin-bottom: 16px;
    }

    /* Style the submit button */
    input[type=submit] {
      background-color: #04AA6D;
      color: white;
    }

    #feedback {
      text-align : center;
    }
    /* Style the container for inputs */
    .container {
      background-color: #f1f1f1;
      padding: 20px;
    }

    /* The message box is shown when the user clicks on the password field */
    #message {
      display:none;
      background: #f1f1f1;
      color: #000;
      position: relative;
      padding: 20px;
      margin-top: 10px;
      text-align : center;
    }

    #message p {
      padding: 10px 35px;
      font-size: 18px;
    }

    /* Add a green text color and a checkmark when the requirements are right */
    .valid {
      color: green;
    }

    .valid:before {
      position: relative;
      left: -35px;
      /*content: "&#10004;";*/
      content: "\2713";
    }

    /* Add a red text color and an "x" icon when the requirements are wrong */
    .invalid {
      color: red;
    }

    .invalid:before {
      position: relative;
      left: -35px;
      content: "\10102";
    }

    .center {
    margin: auto;
    width: 50%;
    padding: 10px;
    text-align: center;
    }
    </style>
  </head>

  <!-- Localize fields labels -->
  <body onload="localizeLabels();">
</html>


<!--RESET FORM------------------------------------------------------------------------------------------------------------->
<div class ="container">
<form id="resetForm" action="validatePassword()" onsubmit="return ajaxcall();">

<table width="100%"  border="0">
<tr>
 <th id="label_code" height="62" scope="row">-</th>
 <td width="76%"><input type="text" name="code" id="code" value="<?php echo $_GET["code"];?>"  class="form-control" required readonly/></td>
</tr>

<tr>
 <th id="label_pwd" height="62" scope="row" >-</th>
 <td width="76%"><input type="password" name="password" id="password" value=""  pattern="(?=.*).{8,}" class="form-control" required /></td>
</tr>

<tr>
<th height="62" scope="row"></th>
<td width="71%"><input type="submit" name="login" value="Submit" class="btn-group-sm" /> </td>
</tr>
</table>

</form>
</div>


<div class = "center"><label id="feedback"   style = "text-align: center;">Message will appear here...</label></div>


<div id="message">
  <h3 id="reset-message-title">Password must contain the following:</h3>
  <p id="reset-message-length" class="invalid">Minimum <b>8 characters</b></p>
</div>

<!--JAVASCRIPT------------------------------------------------------------------------------------------------------------->
<script>
function ajaxcall () {
  // (B1) GET FORM DATA
  var data = new FormData(document.getElementById("resetForm"));
  document.getElementById('feedback').innerHTML = "Updating password. Please wait...";
  // (B2) AJAX CALL
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "updatepassword.php?lang=<?php echo $_SESSION['lang'] ?>");
  xhr.onload = function () {
    document.getElementById("feedback").style.display = 'inline';
    document.getElementById('feedback').innerHTML = this.response;
    console.log(this.response);
  };
  xhr.send(data);
  return false;
}
</script>

<script>
var myInput = document.getElementById("password");
var length = document.getElementById("reset-message-length");

// When the user clicks on the password field, show the message box
myInput.onfocus = function() {
  document.getElementById("message").style.display = "block";
}

// When the user clicks outside of the password field, hide the message box
myInput.onblur = function() {
  document.getElementById("message").style.display = "none";
}

// When the user starts to type something inside the password field
myInput.onkeyup = function() {
  // Validate length
  if(myInput.value.length >= 8) {
    length.classList.remove("invalid");
    length.classList.add("valid");
  } else {
    length.classList.remove("valid");
    length.classList.add("invalid");
  }
}
</script>

<script>
  function localizeLabels()
  {
    document.getElementById("label_pwd").innerHTML = "<?php echo $lang['label_new_password']; ?>";
    document.getElementById("label_code").innerHTML = "<?php echo $lang['label_activation_code']; ?>";
    document.getElementById("reset-message-title").innerHTML = "<?php echo $lang['message-title']; ?>";
    document.getElementById("reset-message-length").innerHTML = "<?php echo $lang['message-length']; ?>";
    //Hide confirmation message label
    document.getElementById("feedback").style.display = 'none';
  }
</script>
