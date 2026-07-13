<?php

namespace OntoMatchGame\Tests\Integration;

use OntoMatchGame\Tests\Support\IntegrationTestCase;

final class SignupTest extends IntegrationTestCase
{
    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'username' => 'alice',
            'email' => 'alice@example.test',
            'password' => 'super-secret',
            'age' => 30,
            'firstname' => 'Alice',
            'lastname' => 'Anderson',
            'country' => 'France',
            'countryCode' => 'FR',
            'optin' => 'true',
        ], $overrides);
    }

    public function testHappyPathCreatesAccountAndSendsActivationEmail(): void
    {
        $response = $this->http->postJson('/userSave.php', $this->validPayload());

        self::assertSame(200, $response->status);
        self::assertTrue($response->json()->code);

        $user = $this->findUserByEmail('alice@example.test');
        self::assertNotNull($user);
        self::assertSame('alice', $user['username']);
        self::assertSame(hash('sha256', 'super-secret'), $user['password']);

        $expectedActivationCode = hash('sha256', 'alice@example.test');
        self::assertSame($expectedActivationCode, $user['activationcode']);
        self::assertSame('France', $user['country']);
        self::assertSame('FR', $user['countryCode']);
        self::assertSame(1, (int) $user['optin']);
        self::assertSame(0, (int) $user['status']);

        $history = $this->db()->query('SELECT * FROM History WHERE userId = ' . (int) $user['userId']);
        self::assertSame(1, $history->num_rows);

        self::assertSame(1, $this->mail->count());
        $message = $this->mail->messages()[0];
        self::assertStringContainsString('alice@example.test', $message);
        self::assertStringContainsString('olivier.marlet@univ-tours.fr', $message);
        self::assertStringContainsString('Activate your OntoMatchGame account!', $message);
        self::assertStringContainsString(
            'https://ontomatchgame.huma-num.fr/php/verification.php?code=' . $expectedActivationCode . '&lang=en',
            $message
        );
    }

    public function testMissingEmailIsRejected(): void
    {
        $response = $this->http->postJson('/userSave.php', $this->validPayload(['email' => '']));

        // ltrim: connect.php emits a stray whitespace byte after its closing
        // PHP tag, which precedes every response body from any endpoint
        // that includes it. Not related to what this test is characterizing.
        self::assertStringStartsWith('{"code":false}', ltrim($response->body));
        self::assertNull($this->findUserByEmail('alice@example.test'));
        self::assertSame(0, $this->mail->count());
    }

    public function testInvalidEmailFormatIsRejected(): void
    {
        $response = $this->http->postJson('/userSave.php', $this->validPayload(['email' => 'not-an-email']));

        self::assertStringStartsWith('{"code":false}', ltrim($response->body));
        self::assertNull($this->findUserByEmail('not-an-email'));
        self::assertSame(0, $this->mail->count());
    }

    public function testMissingPasswordIsRejected(): void
    {
        $response = $this->http->postJson('/userSave.php', $this->validPayload(['password' => '']));

        self::assertStringStartsWith('{"code":false}', ltrim($response->body));
        self::assertNull($this->findUserByEmail('alice@example.test'));
        self::assertSame(0, $this->mail->count());
    }

    public function testMissingCountryIsRejected(): void
    {
        $response = $this->http->postJson('/userSave.php', $this->validPayload(['country' => '']));

        self::assertStringStartsWith('{"code":false}', ltrim($response->body));
        self::assertNull($this->findUserByEmail('alice@example.test'));
        self::assertSame(0, $this->mail->count());
    }

    public function testMissingCountryCodeIsRejected(): void
    {
        $response = $this->http->postJson('/userSave.php', $this->validPayload(['countryCode' => '']));

        self::assertStringStartsWith('{"code":false}', ltrim($response->body));
        self::assertNull($this->findUserByEmail('alice@example.test'));
        self::assertSame(0, $this->mail->count());
    }

    /**
     * Characterizes current behavior: userSave.php has no duplicate-email
     * check and the email column has no UNIQUE constraint, so signing up
     * twice with the same email silently creates a second account.
     */
    public function testDuplicateSignupCreatesASecondAccount(): void
    {
        $this->insertUser(['email' => 'alice@example.test']);

        $response = $this->http->postJson('/userSave.php', $this->validPayload());

        self::assertTrue($response->json()->code);

        $result = $this->db()->query("SELECT COUNT(*) AS n FROM UserAccount WHERE email = 'alice@example.test'");
        self::assertSame(2, (int) $result->fetch_assoc()['n']);
    }
}
