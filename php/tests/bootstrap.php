<?php

// PHPUnit bootstrap for the OntoMatchGame integration suite.
//
// The endpoints under test are top-level scripts (session_start(), header(),
// exit()) rather than includable units, so they're exercised as real HTTP
// requests against `php -S` — same execution model as production under
// Apache — instead of being `include`d in-process.

declare(strict_types=1);

$phpDir = dirname(__DIR__);
$testsDir = __DIR__;

require $phpDir . '/vendor/autoload.php';

// --- 1. Force APP_ENV=test so connect.php (via Symfony Dotenv) loads
//        php/.env.test instead of the real .env/.env.local. ---
putenv('APP_ENV=test');
$_ENV['APP_ENV'] = $_SERVER['APP_ENV'] = 'test';

// --- 2. Bring up the disposable MySQL container if it isn't already. ---
$dbHost = '127.0.0.1';
$dbPort = 3307;

if (!@fsockopen($dbHost, $dbPort, $errno, $errstr, 0.5)) {
    fwrite(STDERR, "[bootstrap] Test DB not reachable on {$dbHost}:{$dbPort}, starting it via docker compose...\n");
    $composeFile = $testsDir . '/docker-compose.yml';
    $cmd = sprintf(
        'docker compose -f %s up -d --wait --wait-timeout 90 2>&1',
        escapeshellarg($composeFile)
    );
    exec($cmd, $output, $exitCode);
    if ($exitCode !== 0) {
        fwrite(STDERR, implode("\n", $output) . "\n");
        throw new RuntimeException('Failed to start the test MySQL container (see output above). Is Docker running?');
    }
    fwrite(STDERR, "[bootstrap] Container reports healthy, waiting for the real networked server...\n");
}

// The MySQL image's healthcheck can report "healthy" while pinging its own
// temporary init-script server (socket-only), just before it restarts into
// the real networked one — so confirm with an actual query, not just a
// TCP connect or the container healthcheck.
$dbDeadline = microtime(true) + 30;
$dbReady = false;
$lastError = null;
while (microtime(true) < $dbDeadline) {
    try {
        $probe = @new mysqli($dbHost, 'ontomatchgame_test', 'test_password', 'ontomatchgame', $dbPort);
        $probe->query('SELECT 1');
        $probe->close();
        $dbReady = true;
        break;
    } catch (\mysqli_sql_exception $e) {
        $lastError = $e->getMessage();
        usleep(300_000);
    }
}
if (!$dbReady) {
    throw new RuntimeException('Test DB never became queryable: ' . $lastError);
}
fwrite(STDERR, "[bootstrap] Test DB is up.\n");

// --- 3. Route mail() to a capture file instead of actually sending. ---
$mailCaptureFile = sys_get_temp_dir() . '/ontomatchgame-test-mail.eml';
@unlink($mailCaptureFile);
touch($mailCaptureFile);
putenv('MAIL_CAPTURE_FILE=' . $mailCaptureFile);
$_ENV['MAIL_CAPTURE_FILE'] = $mailCaptureFile;
define('TEST_MAIL_CAPTURE_FILE', $mailCaptureFile);

// --- 4. Start the built-in server serving php/ with the fake sendmail. ---
$host = '127.0.0.1';
$port = 8098;
define('TEST_BASE_URL', "http://{$host}:{$port}");

// A server from a previous run that was killed without going through the
// shutdown function (e.g. the process was SIGKILL'd) leaves this port bound.
// A plain "does something answer" check would then pass against that stale
// server instead of the one we're about to start, silently running tests
// against outdated ini settings/code. Since this port is dedicated to the
// test suite, just reclaim it.
if (@fsockopen($host, $port, $errno, $errstr, 0.2)) {
    fwrite(STDERR, "[bootstrap] Port {$port} already bound by a stale process, freeing it...\n");
    exec(sprintf('fuser -k %d/tcp 2>/dev/null', $port));
    usleep(300_000);
}

$fakeSendmail = $testsDir . '/Support/fake-sendmail.php';
$router = $testsDir . '/Support/router.php';
$phpBinary = PHP_BINARY;
$sendmailPath = escapeshellcmd($phpBinary) . ' ' . escapeshellarg($fakeSendmail);

$serverCmd = sprintf(
    '%s -d sendmail_path=%s -d display_errors=1 -d error_reporting=%s -S %s:%d -t %s %s',
    escapeshellcmd($phpBinary),
    escapeshellarg($sendmailPath),
    // Exclude deprecation notices: the legacy endpoints under test call
    // things like mysqli::ping() that PHP 8.4 flags as deprecated, and
    // display_errors=1 would otherwise prepend that HTML to every
    // response body, corrupting the JSON we assert on.
    escapeshellarg('E_ALL & ~E_DEPRECATED'),
    $host,
    $port,
    escapeshellarg($phpDir),
    // Without this router, per-request $_SERVER/$_ENV don't carry APP_ENV
    // (only getenv() does), so connect.php's Dotenv cascade silently loads
    // .env/.env.local — the real database — instead of .env.test. See
    // tests/Support/router.php.
    escapeshellarg($router)
);

$descriptors = [
    0 => ['pipe', 'r'],
    1 => ['pipe', 'w'],
    2 => ['pipe', 'w'],
];

$serverProcess = proc_open($serverCmd, $descriptors, $pipes, $phpDir);
if (!is_resource($serverProcess)) {
    throw new RuntimeException('Failed to start the built-in PHP test server.');
}
stream_set_blocking($pipes[1], false);
stream_set_blocking($pipes[2], false);

// Wait for the server to accept connections.
$deadline = microtime(true) + 10;
$up = false;
while (microtime(true) < $deadline) {
    $conn = @fsockopen($host, $port, $errno, $errstr, 0.2);
    if ($conn) {
        fclose($conn);
        $up = true;
        break;
    }
    usleep(100_000);
}
if (!$up) {
    proc_terminate($serverProcess);
    throw new RuntimeException('Test PHP server did not come up on ' . TEST_BASE_URL);
}

register_shutdown_function(function () use ($serverProcess, $pipes) {
    foreach ($pipes as $pipe) {
        if (is_resource($pipe)) {
            fclose($pipe);
        }
    }
    if (is_resource($serverProcess)) {
        proc_terminate($serverProcess);
        proc_close($serverProcess);
    }
});
