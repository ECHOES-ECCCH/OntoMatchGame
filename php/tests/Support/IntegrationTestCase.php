<?php

namespace OntoMatchGame\Tests\Support;

use mysqli;
use PHPUnit\Framework\TestCase;

abstract class IntegrationTestCase extends TestCase
{
    protected HttpClient $http;
    protected MailCapture $mail;
    private mysqli $db;

    protected function setUp(): void
    {
        parent::setUp();

        $this->http = new HttpClient(TEST_BASE_URL);
        $this->mail = new MailCapture(TEST_MAIL_CAPTURE_FILE);
        $this->mail->clear();

        $this->db = new mysqli('127.0.0.1', 'ontomatchgame_test', 'test_password', 'ontomatchgame', 3307);
        $this->db->query('SET FOREIGN_KEY_CHECKS = 0');
        $this->db->query('TRUNCATE TABLE UserAccount');
        $this->db->query('TRUNCATE TABLE History');
    }

    protected function tearDown(): void
    {
        $this->db->close();
        parent::tearDown();
    }

    protected function db(): mysqli
    {
        return $this->db;
    }

    /** @return array<string,mixed>|null */
    protected function findUserByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM UserAccount WHERE email = ?');
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();

        return $row === null ? null : $row;
    }

    /** Inserts a UserAccount row directly (bypassing the API) for test fixtures. */
    protected function insertUser(array $overrides = []): array
    {
        $user = array_merge([
            'username' => 'fixture_user',
            'email' => 'fixture@example.test',
            'password' => hash('sha256', 'fixture_password'),
            'activationcode' => hash('sha256', 'fixture@example.test'),
            'age' => 30,
            'firstname' => 'Fix',
            'lastname' => 'Ture',
            'country' => 'France',
            'countryCode' => 'FR',
            'status' => 0,
            'optin' => 0,
        ], $overrides);

        $stmt = $this->db->prepare('
            INSERT INTO UserAccount
                (username, email, password, activationcode, age, firstname, lastname, country, countryCode, status, optin)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ');
        $stmt->bind_param(
            'ssssisssii',
            $user['username'],
            $user['email'],
            $user['password'],
            $user['activationcode'],
            $user['age'],
            $user['firstname'],
            $user['lastname'],
            $user['country'],
            $user['countryCode'],
            $user['status'],
            $user['optin'],
        );
        $stmt->execute();
        $user['userId'] = $this->db->insert_id;

        return $user;
    }
}
