<?php
	// Auth session helpers, separate from the PHP $_SESSION['lang'] usage
	// elsewhere in this codebase (reset.php, userSave.php, ...) which is
	// unrelated to login state.

	function startSecureSession()
	{
		if (session_status() === PHP_SESSION_NONE) {
			// The session cookie itself has no expiry (lifetime 0: it dies
			// with the browser tab), but PHP's server-side garbage collector
			// purges the underlying session data on its own clock. Without
			// this, gc_maxlifetime defaults to ~24 minutes, so a player who
			// stays idle (reading, alt-tabbed) longer than that keeps a
			// "connected" tab whose session data has already been deleted:
			// the next API call gets a 401 despite the user never logging out.
			// Align GC lifetime with a realistic play session length instead.
			ini_set('session.gc_maxlifetime', 14400); // 4 hours
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
