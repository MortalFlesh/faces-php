<?php declare(strict_types=1);

namespace MF\Faces\Smiley\ValueObject;

use MF\Faces\ValueObject\ResponseInterface;

readonly class Smiley implements ResponseInterface
{
    public function __construct(private string $smiley) {}

    public function getSmiley(): string
    {
        return $this->smiley;
    }

    public function jsonSerialize(): array
    {
        return [
            'smiley' => $this->smiley,
        ];
    }
}
