<?php declare(strict_types=1);

namespace MF\Faces\ValueObject;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

interface AppInterface
{
    public static function getRole(): ?string;

    public static function path(): string;

    public function getPath(): string;

    public function handle(Request $request): Response|ResponseInterface;
}
