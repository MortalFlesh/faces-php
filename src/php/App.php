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
        $data = [];

        $face = new Face('😀', '#00B894');
        $face2 = new Face('😎', '#0984E3');

        $enableSleep = false;

        if ($enableSleep) {
            $sleepMilliseconds = $this->dice->roll() * 100;
            usleep($sleepMilliseconds * 1000);

            $data += ['sleep' => $sleepMilliseconds];
        }

        return new JsonResponse(UnifiedResponse::fromRequest(
            $request,
            $this->dice->roll() > 3 ? $face : $face2,
            $data,
        ));
    }
}
