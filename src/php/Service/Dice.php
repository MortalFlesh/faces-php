<?php declare(strict_types=1);

namespace MF\Faces\Service;

class Dice
{
    public function roll(): int
    {
        return random_int(1, 6);
    }
}
