<?php declare(strict_types=1);

namespace MF\Faces\Service;

use MF\Collection\Immutable\Generic\IList;
use MF\Collection\Immutable\Generic\ListCollection;
use MF\Faces\HealthCheck\HealthCheckApp;
use MF\Faces\ValueObject\AppInterface;

class RoleManager
{
    public function __construct(private AppFactory $appFactory) {}

    /** @phpstan-return IList<AppInterface> */
    public function getHandlersForRole(?string $role): IList
    {
        /** @phpstan-var ListCollection<AppInterface> */
        $handlers = ListCollection::from([
            new HealthCheckApp(),
            $this->appFactory->createInfoApp(),
        ]);

        return match ($role) {
            'face' => $handlers->add($this->appFactory->createFaceApp()),
            'color' => $handlers->add($this->appFactory->createColorApp()),
            'smiley' => $handlers->add($this->appFactory->createSmileyApp()),

            default => $handlers->append(ListCollection::from([
                $this->appFactory->createFaceApp(),
                $this->appFactory->createColorApp(),
                $this->appFactory->createSmileyApp(),
            ])),
        };
    }
}
