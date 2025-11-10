<?php declare(strict_types=1);

namespace MF\Faces\Color;

use MF\Collection\Immutable\Generic\IMap;
use MF\Collection\Immutable\Generic\Map;
use MF\Faces\Color\ValueObject\Color;
use MF\Faces\Service\Environment;
use MF\Faces\ValueObject\AppInterface;
use MF\Faces\ValueObject\ResponseInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ColorApp implements AppInterface
{
    /** @var IMap<string, string> */
    private IMap $colors;
    private string $selectedColor;

    public function __construct(Environment $environment)
    {
        $this->selectedColor = $environment->tryGetValue('COLOR') ?? '*first*';

        /** @phpstan-var Map<string, string> */
        $colors = Map::from([
            'mint' => '#96CEB4',
            'gold' => '#FFD700',
            'coral' => '#FF6B6B',
            'teal' => '#4ECDC4',
            'cyan' => '#45B7D1',
            'cream' => '#FFEAA7',
            'lightgray' => '#DFE6E9',
            'lavender' => '#A29BFE',
            'salmon' => '#FF7675',
            'sky' => '#74B9FF',
            'violet' => '#A29BFE',
            'pink' => '#FD79A8',
            'amber' => '#FDCB6E',
            'indigo' => '#6C5CE7',
            'green' => '#00B894',
            'terracotta' => '#E17055',
        ]);
        $this->colors = $colors;
    }

    public static function path(): string
    {
        return '/color';
    }

    public function getPath(): string
    {
        return self::path();
    }

    public function handle(Request $request): Response|ResponseInterface
    {
        $color = $this->colors->containsKey($this->selectedColor)
            ? $this->colors->get($this->selectedColor)
            : $this->colors->toList()->first()?->second();

        return new Color((string) $color);
    }
}
