<?php declare(strict_types=1);

namespace MF\Faces;

use MF\Collection\Immutable\Generic\IList;
use MF\Faces\Service\AppFactory;
use MF\Faces\Service\Dice;
use MF\Faces\Service\Environment;
use MF\Faces\Service\RoleManager;
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
    private ?string $role;

    public function __construct()
    {
        $this->dice = new Dice();
        $this->environment = new Environment();
        $roleManager = new RoleManager(new AppFactory($this->environment));

        $this->role = $this->environment->tryGetValue('ROLE');

        $this->handlers = $roleManager->getHandlersForRole($this->role);
    }

    public function handle(Request $request): Response
    {
        $path = $request->getPathInfo();
        $additionalData = [];

        if ($this->role && (empty($path) || $path === '/')) {
            $path = sprintf('/%s', $this->role);
        }

        $response = $this->handlers
            ->firstBy(fn(AppInterface $handler) => $handler->getPath() === $path)
            ?->handle($request)
            ?? new JsonResponse(
                UnifiedResponse::fromRequest($request, ['message' => 'Not Found'], $additionalData),
                Response::HTTP_NOT_FOUND,
            );

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
