<?php

namespace OntoMatchGame\Tests\Support;

// Reads whatever fake-sendmail.php recorded instead of actually sending mail.
final class MailCapture
{
    public function __construct(private readonly string $captureFile)
    {
    }

    public function clear(): void
    {
        if (file_exists($this->captureFile)) {
            unlink($this->captureFile);
        }
    }

    /** @return string[] Raw RFC822 messages (headers + body) captured so far, oldest first. */
    public function messages(): array
    {
        if (!file_exists($this->captureFile)) {
            return [];
        }

        $contents = file_get_contents($this->captureFile);
        preg_match_all('/----BEGIN-MAIL----\n(.*?)\n----END-MAIL----/s', $contents, $matches);

        return $matches[1];
    }

    public function count(): int
    {
        return count($this->messages());
    }
}
