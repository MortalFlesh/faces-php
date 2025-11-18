<?php declare(strict_types=1);

namespace MF\Faces\HealthCheck;

use MF\Faces\ValueObject\AppInterface;
use MF\Faces\ValueObject\ResponseInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class HealthCheckApp implements AppInterface
{
    public static function path(): string
    {
        return '/health-check';
    }

    public function getPath(): string
    {
        return self::path();
    }

    public function handle(Request $request): Response|ResponseInterface
    {
        return new Response('OK', Response::HTTP_OK);
    }

    public static function getRole(): ?string
    {
        return null;
    }
}
