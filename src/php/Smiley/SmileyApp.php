<?php declare(strict_types=1);

namespace MF\Faces\Smiley;

use MF\Collection\Immutable\Generic\IMap;
use MF\Collection\Immutable\Generic\Map;
use MF\Faces\Service\Environment;
use MF\Faces\Smiley\ValueObject\Smiley;
use MF\Faces\ValueObject\AppInterface;
use MF\Faces\ValueObject\ResponseInterface;
use Symfony\Component\HttpFoundation\Request;

class SmileyApp implements AppInterface
{
    /** @var IMap<string, string> */
    private IMap $smileys;
    private string $selectedSmiley;

    public function __construct(Environment $environment)
    {
        $this->selectedSmiley = $environment->tryGetValue('SMILEY') ?? '*first*';

        /** @phpstan-var Map<string, string> $smileys */
        $smileys = Map::from([
            'happy' => '😀',
            'sad' => '😢',
            'angry' => '😠',
            'surprised' => '😲',
            'love' => '😍',
            'wink' => '😉',
            'cool' => '😎',
            'confused' => '😕',
            'party' => '🥳',
            'sick' => '🤒',
            'thinking' => '🤔',
            'upside_down' => '🙃',
            'crazy' => '🤪',
            'nerd' => '🤓',
        ]);
        $this->smileys = $smileys;
    }

    public static function getRole(): ?string
    {
        return 'smiley';
    }

    public static function path(): string
    {
        return sprintf('/%s', self::getRole());
    }

    public function getPath(): string
    {
        return self::path();
    }

    public function handle(Request $request): ResponseInterface
    {
        $smiley = $this->smileys->containsKey($this->selectedSmiley)
            ? $this->smileys->get($this->selectedSmiley)
            : $this->smileys->toList()->first()?->second();

        return new Smiley((string) $smiley);
    }
}
