<?php declare(strict_types=1);

namespace MF\Faces;

use MF\Collection\Immutable\Generic\IList;
use MF\Collection\Immutable\Generic\ListCollection;
use MF\Faces\HealthCheck\HealthCheckApp;
use MF\Faces\Service\AppFactory;
use MF\Faces\Service\Dice;
use MF\Faces\Service\Environment;
use MF\Faces\ValueObject\AppInterface;
use MF\Faces\ValueObject\UnifiedResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class App
{
    private Dice $dice;
    private Environment $environment;
    /** @var IList<AppInterface> */
    private IList $handlers;

    public function __construct()
    {
        $this->dice = new Dice();
        $this->environment = new Environment();
        $appFactory = new AppFactory($this->environment);

        /** @phpstan-var ListCollection<AppInterface> */
        $handlers = ListCollection::from([
            new HealthCheckApp(),
            $appFactory->createFaceApp(),
            $appFactory->createColorApp(),
            $appFactory->createSmileyApp(),
            $appFactory->createInfoApp(),
        ]);

        $this->handlers = $handlers;
    }

    public function handle(Request $request): Response
    {
        $path = $request->getPathInfo();
        $additionalData = [];

        $response = $this->handlers
            ->firstBy(fn(AppInterface $handler) => $handler->getPath() === $path)
            ?->handle($request)
            ?? new JsonResponse(['message' => 'Not Found'], Response::HTTP_NOT_FOUND);

        if ($this->environment->getBoolean('ENABLE_SLEEP')) {
            $sleepMilliseconds = $this->dice->roll() * 100;
            usleep($sleepMilliseconds * 1000);

            $additionalData += ['sleep' => $sleepMilliseconds];
        }

        if ($response instanceof Response) {
            return $response;
        }

        $response = new JsonResponse(UnifiedResponse::fromRequest($request, $response, $additionalData));
        $response->setEncodingOptions(JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return $response;
    }
}
