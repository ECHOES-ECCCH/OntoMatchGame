<?php
	// Auth session helpers, separate from the PHP $_SESSION['lang'] usage
	// elsewhere in this codebase (reset.php, userSave.php, ...) which is
	// unrelated to login state.

	function startSecureSession()
	{
		if (session_status() === PHP_SESSION_NONE) {
			session_set_cookie_params([
				'lifetime' => 0,
				'path' => '/',
				'httponly' => true,
				'samesite' => 'Lax',
				'secure' => !empty($_SERVER['HTTPS']),
			]);
			session_start();
		}
	}

	// Returns the authenticated userId, or responds 401 and exits.
	function requireAuth(): int
	{
		startSecureSession();

		if (empty($_SESSION['userId'])) {
			header('Content-Type: application/json');
			http_response_code(401);
			echo json_encode(['error' => 'Not authenticated']);
			exit;
		}

		return (int)$_SESSION['userId'];
	}
?>
