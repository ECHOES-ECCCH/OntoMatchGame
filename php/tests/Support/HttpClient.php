<?php

namespace OntoMatchGame\Tests\Support;

// Thin curl wrapper for driving the endpoints as real HTTP requests against
// the test built-in server (tests/bootstrap.php). Each request is a fresh
// PHP process under `php -S`, same as in production under Apache, so
// header()/exit()/session_start() in the scripts under test behave normally
// instead of fighting an in-process include.
final class HttpClient
{
    public function __construct(private readonly string $baseUrl)
    {
    }

    public function postJson(string $path, array $body, ?string $cookieJar = null): HttpResponse
    {
        return $this->request('POST', $path, json_encode($body), ['Content-Type: application/json'], $cookieJar);
    }

    public function postForm(string $path, array $fields, ?string $cookieJar = null): HttpResponse
    {
        return $this->request('POST', $path, http_build_query($fields), ['Content-Type: application/x-www-form-urlencoded'], $cookieJar);
    }

    public function get(string $path, ?string $cookieJar = null): HttpResponse
    {
        return $this->request('GET', $path, null, [], $cookieJar);
    }

    private function request(string $method, string $path, ?string $body, array $headers, ?string $cookieJar): HttpResponse
    {
        $ch = curl_init($this->baseUrl . $path);
        curl_setopt_array($ch, [
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => false,
            CURLOPT_FOLLOWLOCATION => false,
        ]);

        if ($cookieJar !== null) {
            curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieJar);
            curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieJar);
        }

        $responseBody = curl_exec($ch);
        if ($responseBody === false) {
            throw new \RuntimeException('HTTP request failed: ' . curl_error($ch));
        }

        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return new HttpResponse($status, $responseBody);
    }
}
