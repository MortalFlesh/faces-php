<?php declare(strict_types=1);

namespace MF\Faces\Color\ValueObject;

use MF\Faces\ValueObject\ResponseInterface;

readonly class Color implements ResponseInterface
{
    public function __construct(private string $color) {}

    public function getColor(): string
    {
        return $this->color;
    }

    public function jsonSerialize(): array
    {
        return [
            'color' => $this->color,
        ];
    }
}
