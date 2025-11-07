<?php declare(strict_types=1);

namespace MF\Faces;
use MF\Faces\ValueObject\Face;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class App
{
    public function handle(Request $request): Response
    {
        return match ($request->getPathInfo()) {
            '/face' => $this->face($request),
            default => new JsonResponse(['message' => 'Not Found'], Response::HTTP_NOT_FOUND),
        };
    }

    public function face(Request $request): Response
    {
        $face = new Face('😀', '#00B894');

        return new JsonResponse($face);
    }
}
