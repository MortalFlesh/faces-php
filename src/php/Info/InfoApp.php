<?php declare(strict_types=1);

namespace MF\Faces\Info;

use MF\Faces\Info\ValueObject\Info;
use MF\Faces\Service\Environment;
use MF\Faces\ValueObject\AppInterface;
use MF\Faces\ValueObject\ResponseInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class InfoApp implements AppInterface
{
    public function __construct(private Environment $environment) {}

    public static function getRole(): ?string
    {
        return null;
    }

    public static function path(): string
    {
        return '/info';
    }

    public function getPath(): string
    {
        return self::path();
    }

    public function handle(Request $request): Response|ResponseInterface
    {
        $composerFileContents = file_get_contents(__DIR__ . '/../../../composer.json');
        $composer = is_string($composerFileContents) ? json_decode($composerFileContents, true) : [];

        return new Info(
            $composer,
            $this->environment->getApplicationValues(),
        );
    }
}
