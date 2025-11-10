<?php declare(strict_types=1);

namespace MF\Faces\Face\Query;

use Lmc\Cqrs\Http\Query\AbstractHttpGetQuery;
use Lmc\Cqrs\Types\ValueObject\CacheTime;
use MF\Faces\Color\ColorApp;
use MF\Faces\Service\UrlFactory;
use Psr\Http\Message\RequestFactoryInterface;
use Psr\Http\Message\UriInterface;

class ColorQuery extends AbstractHttpGetQuery
{
    private const HOST_NAME = 'COLOR_HOST';

    public function __construct(RequestFactoryInterface $requestFactory, private UrlFactory $urlFactory)
    {
        parent::__construct($requestFactory);
    }

    public function getUri(): UriInterface|string
    {
        return $this->urlFactory->createUrl(self::HOST_NAME, ColorApp::path());
    }

    public function getCacheTime(): CacheTime
    {
        return CacheTime::noCache();
    }
}
