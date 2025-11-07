<?php declare(strict_types=1);

namespace MF\Faces\ValueObject;

readonly class Face implements \JsonSerializable
{
    public function __construct(private string $smiley, private string $color)
    {
    }

    public function jsonSerialize(): array
    {
        return [
            'smiley' => $this->smiley,
            'color' => $this->color,
        ];
    }
}
