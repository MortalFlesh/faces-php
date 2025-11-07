<?php declare(strict_types=1);

namespace MF\Faces;
use MF\Faces\Service\Dice;
use MF\Faces\ValueObject\Face;
use MF\Faces\ValueObject\UnifiedResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class App
{
    private Dice $dice;

    public function __construct()
    {
        $this->dice = new Dice();
    }

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
        $sleep = $this->dice->roll() * 1000;

        usleep($sleep);

        return new JsonResponse(UnifiedResponse::fromRequest($request, $face, ['sleep' => $sleep]));
    }
}
