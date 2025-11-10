<?php declare(strict_types=1);

namespace MF\Faces\ValueObject;

interface ResponseInterface extends \JsonSerializable
{
    public function jsonSerialize(): array;
}
