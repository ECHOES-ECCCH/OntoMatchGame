-- Test-only schema for the integration test DB.
--
-- This intentionally does NOT reuse utils/createtable.php: that script is
-- stale (missing countryCode/optin, uses a `gamename` column that no query
-- in the codebase still reads/writes). Columns here are derived from what
-- userSave.php actually INSERTs and what the other endpoints SELECT.

CREATE TABLE IF NOT EXISTS UserAccount (
    userId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    activationcode VARCHAR(255) NOT NULL,
    age INT NOT NULL DEFAULT 0,
    firstname VARCHAR(50) NOT NULL DEFAULT '',
    lastname VARCHAR(50) NOT NULL DEFAULT '',
    country VARCHAR(50) NOT NULL,
    countryCode VARCHAR(10) NOT NULL,
    status INT NOT NULL DEFAULT 0,
    optin TINYINT UNSIGNED NOT NULL DEFAULT 0,
    user_create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS History (
    historyId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    userId INT UNSIGNED NOT NULL
);
