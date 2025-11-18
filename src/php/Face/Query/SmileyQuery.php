<?php declare(strict_types=1);

namespace MF\Faces\Face\Query;

use Lmc\Cqrs\Http\Query\AbstractHttpGetQuery;
use Lmc\Cqrs\Types\ValueObject\CacheTime;
use MF\Faces\Service\UrlFactory;
use MF\Faces\Smiley\SmileyApp;
use Psr\Http\Message\RequestFactoryInterface;
use Psr\Http\Message\UriInterface;

class SmileyQuery extends AbstractHttpGetQuery
{
    private const HOST_NAME = 'SMILEY_HOST';

    public function __construct(RequestFactoryInterface $requestFactory, private UrlFactory $urlFactory)
    {
        parent::__construct($requestFactory);
    }

    public function getUri(): UriInterface|string
    {
        return $this->urlFactory->createUrl(self::HOST_NAME, SmileyApp::path());
    }

    public function getCacheTime(): CacheTime
    {
        return CacheTime::noCache();
    }
}
