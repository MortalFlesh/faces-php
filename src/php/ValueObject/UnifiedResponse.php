<?php declare(strict_types=1);

namespace MF\Faces\ValueObject;

use Symfony\Component\HttpFoundation\Request;

readonly class UnifiedResponse implements ResponseInterface
{
    public function __construct(
        private string $clientAddress,
        private int $status,
        private array $headers,
        private string $method,
        private string $path,
        private \JsonSerializable|array $body,
        private array $additional = [],
    ) {}

    public static function fromRequest(Request $request, \JsonSerializable|array $body, array $additional = []): self
    {
        return new self(
            clientAddress: $request->getClientIp() ?? 'unknown',
            status: $request->attributes->getInt('response_status', 200),
            headers: $request->headers->all(),
            method: $request->getMethod(),
            path: $request->getPathInfo(),
            body: $body,
            additional: $additional,
        );
    }

    public function jsonSerialize(): array
    {
        return array_merge(
            $this->additional,
            [
                'client_address' => $this->clientAddress,
                'status' => $this->status,
                'headers' => $this->headers,
                'method' => $this->method,
                'path' => $this->path,
            ],
            is_array($this->body) ? $this->body : $this->body->jsonSerialize(),
        );
    }
}
