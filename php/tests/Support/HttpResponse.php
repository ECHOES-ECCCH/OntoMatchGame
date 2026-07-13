<?php

namespace OntoMatchGame\Tests\Support;

final class HttpResponse
{
    public function __construct(
        public readonly int $status,
        public readonly string $body,
    ) {
    }

    public function json(): mixed
    {
        return json_decode($this->body);
    }
}
