<?php declare(strict_types=1);

namespace MF\Faces;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class App
{
    public function handle(Request $request): Response
    {
        return new JsonResponse(['message' => 'Hello, World!']);
    }
}
