<?php declare(strict_types=1);

namespace MF\Faces\Service;

use Assert\Assertion;

class Environment
{
    public function tryGetValue(string $name): ?string
    {
        $value = getenv($name);
        if ($value === false) {
            return null;
        }

        Assertion::string($value);

        return $value;
    }

    public function getBoolean(string $name, bool $default = false): bool
    {
        $value = $this->tryGetValue($name);

        if ($value === null) {
            return $default;
        }

        return $value === 'true';
    }

    public function getApplicationValues(): array
    {
        return [
            'LOCALHOST' => $this->tryGetValue('LOCALHOST') ?? 'localhost:8080',
            'ENABLE_SLEEP' => $this->getBoolean('ENABLE_SLEEP'),
            'SMILEY_HOST' => $this->tryGetValue('SMILEY_HOST'),
            'SMILEY' => $this->tryGetValue('SMILEY'),
            'COLOR_HOST' => $this->tryGetValue('COLOR_HOST'),
            'COLOR' => $this->tryGetValue('COLOR'),
            'ROLE' => $this->tryGetValue('ROLE'),
        ];
    }
}
