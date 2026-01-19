<?php
	require dirname(__DIR__).'/vendor/autoload.php';

	use Symfony\Component\Dotenv\Dotenv;

	$dotenv = new Dotenv();

	// Charge .env puis .env.local s’il existe
	$dotenv->loadEnv(dirname(__DIR__).'/.env');

	$dbHost = getenv('DB_HOST');
	$dbHost = getenv('DB_NAME');
	$dbHost = getenv('DB_USER');
	$dbHost = getenv('DB_PASSWORD');

	$connection = mysqli_init();

	if (!$connection) {
		echo "false";
	}
	
	mysqli_ssl_set($connection, NULL,NULL,'/shared/hncert/__db_huma-num_fr_interm_root.cer', '/dev/null', NULL);
	mysqli_real_connect($connection, $dbHost, $dbUser, $dbPassword, $dbName);
?>	