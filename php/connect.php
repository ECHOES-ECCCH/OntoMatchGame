<?php
	require dirname(__DIR__).'/php/vendor/autoload.php';

	use Symfony\Component\Dotenv\Dotenv;

	$dotenv = new Dotenv();

	// Charge .env puis .env.local s’il existe (protégés par php/.htaccess)
	$dotenv->loadEnv(__DIR__.'/.env');

	$dbHost = $_ENV['DB_HOST'];
	$dbName = $_ENV['DB_NAME'];
	$dbUser = $_ENV['DB_USER'];
	$dbPassword = $_ENV['DB_PASSWORD'];
	$dbPort = (int) ($_ENV['DB_PORT'] ?? 3306);

	$connection = mysqli_init();

	if (!$connection) {
		echo "false";
	}

	#mysqli_ssl_set($connection, NULL,NULL,'/shared/hncert/__db_huma-num_fr_interm_root.cer', '/dev/null', NULL);
	mysqli_real_connect($connection, $dbHost, $dbUser, $dbPassword, $dbName, $dbPort);
?>	