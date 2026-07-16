<?php
// Stand-in for /usr/sbin/sendmail, wired in via php.ini's sendmail_path when
// the test built-in server is started (see tests/bootstrap.php). PHP's
// mail() pipes the full RFC822 message (headers + body) to this script's
// stdin instead of actually sending anything.
//
// Appends each captured message to MAIL_CAPTURE_FILE, separated by a marker,
// so tests can assert on what would have been sent.

$captureFile = getenv('MAIL_CAPTURE_FILE');
if ($captureFile === false || $captureFile === '') {
    fwrite(STDERR, "fake-sendmail: MAIL_CAPTURE_FILE not set\n");
    exit(1);
}

$message = stream_get_contents(STDIN);

$entry = "----BEGIN-MAIL----\n" . $message . "\n----END-MAIL----\n";

file_put_contents($captureFile, $entry, FILE_APPEND | LOCK_EX);

exit(0);
