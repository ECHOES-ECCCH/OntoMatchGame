<?php

// Router for the php -S test server (see tests/bootstrap.php).
//
// The built-in server repopulates $_SERVER per request with CGI-style
// variables only — it does NOT inherit arbitrary process environment
// variables such as APP_ENV, even though getenv() still sees them.
// connect.php's Symfony Dotenv reads $_SERVER/$_ENV (not getenv()) to
// decide which .env.* cascade to load, so without this fix every request
// silently fell back to .env/.env.local — i.e. the real local database —
// instead of .env.test's disposable Docker one.
$_SERVER['APP_ENV'] = $_ENV['APP_ENV'] = getenv('APP_ENV') ?: 'dev';

return false;
