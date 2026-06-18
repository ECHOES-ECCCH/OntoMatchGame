<?php
	include("connect.php");
	include("auth.php");

	header('Content-Type: application/json');

	//Check & log DB connexion
	if (!$connection->ping()) {
		printf ("Error: %s\n", $connection->error);
	}

	//DTO down, bool result
	class SigninModelDown
	{
		public $login;
		public $userId;
		public $username;

		public function __construct($b, $userId = null, $username = null)
		{
			$this->login = $b;
			$this->userId = $userId;
			$this->username = $username;
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


	//Search for email / password in DB.UserAccount
	$stmt = $connection->prepare("SELECT userId, username FROM ontomatchgame.UserAccount WHERE email = ? AND password = ?");
	$stmt->bind_param("ss", $email, $password);
	$stmt->execute();
	$result = $stmt->get_result();

	if ($result->num_rows > 0)
	{//Email found
		$row = $result->fetch_assoc();

		startSecureSession();
		session_regenerate_id(true);
		$_SESSION['userId'] = $row['userId'];
		$_SESSION['email'] = $email;

		$result = new SigninModelDown(true, (int)$row['userId'], $row['username']);
		echo json_encode($result);
	}
	else
	{
	  $result = new SigninModelDown(false);
	  echo json_encode($result);
  	}

	mysqli_close($connection);
?>
