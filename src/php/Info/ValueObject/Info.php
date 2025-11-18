<?php declare(strict_types=1);

namespace MF\Faces\Info\ValueObject;

use MF\Faces\ValueObject\ResponseInterface;

readonly class Info implements ResponseInterface
{
    public function __construct(private array $composer, private array $environment) {}

    public function jsonSerialize(): array
    {
        $hostName = (string) gethostname();

        return [
            'info' => [
                'app' => $this->composer['name'] ?? 'mf/faces',
                'version' => $this->composer['version'] ?? 'N/A',
                'current_hostname' => $hostName,
                'current_IP' => gethostbyname($hostName),
                'php_version' => PHP_VERSION,
                'environment' => $this->environment,
            ],
        ];
    }
}
