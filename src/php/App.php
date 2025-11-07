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
        $additionalData = [];
        $data = match ($request->getPathInfo()) {
            '/face' => $this->face($request),
            default => new JsonResponse(['message' => 'Not Found'], Response::HTTP_NOT_FOUND),
        };

        $enableSleep = getenv('ENABLE_SLEEP');
        if ($enableSleep === 'true') {
            $sleepMilliseconds = $this->dice->roll() * 100;
            usleep($sleepMilliseconds * 1000);

            $additionalData += ['sleep' => $sleepMilliseconds];
        }

        if ($data instanceof Response) {
            return $data;
        }

        $response = new JsonResponse(UnifiedResponse::fromRequest($request, $data, $additionalData));
        $response->setEncodingOptions(JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return $response;
    }

    public function face(Request $request): \JsonSerializable
    {
        $face = new Face('😀', '#228833');  // Green from faces-demo
        $face2 = new Face('😎', '#66CCEE'); // Blue from faces-demo

        return $this->dice->roll() > 3 ? $face : $face2;
    }
}
