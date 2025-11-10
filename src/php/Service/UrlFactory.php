<?php declare(strict_types=1);

namespace MF\Faces\Service;

use MF\Collection\Assertion;

class UrlFactory
{
    public function __construct(private Environment $environment) {}

    public function createUrl(string $hostName, string $path): string
    {
        Assertion::startsWith($path, '/');

        $host = $this->environment->tryGetValue($hostName)
            ?? $this->environment->tryGetValue('LOCALHOST')
            ?? '127.0.0.1:8080';

        // var_dump([
        //     'hostName' => $hostName,
        //     'host' => $host,
        //     'path' => $path,
        //     'url' => sprintf('http://%s%s', $host, $path),
        // ]);

        return sprintf('http://%s%s', $host, $path);
    }
}
