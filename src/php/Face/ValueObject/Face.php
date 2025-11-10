<?php declare(strict_types=1);

namespace MF\Faces\Face\ValueObject;

use MF\Faces\Color\ValueObject\Color;
use MF\Faces\Smiley\ValueObject\Smiley;
use MF\Faces\ValueObject\ResponseInterface;

readonly class Face implements ResponseInterface
{
    public function __construct(private Smiley $smiley, private Color $color) {}

    public function jsonSerialize(): array
    {
        return [
            'smiley' => $this->smiley->getSmiley(),
            'color' => $this->color->getColor(),
        ];
    }
}
