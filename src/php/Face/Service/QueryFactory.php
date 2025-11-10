<?php declare(strict_types=1);

namespace MF\Faces\Face\Service;

use MF\Faces\Face\Query\ColorQuery;
use MF\Faces\Face\Query\SmileyQuery;
use MF\Faces\Service\UrlFactory;
use Psr\Http\Message\RequestFactoryInterface;

class QueryFactory
{
    public function __construct(private RequestFactoryInterface $requestFactory, private UrlFactory $urlFactory) {}

    public function createColorQuery(): ColorQuery
    {
        return new ColorQuery($this->requestFactory, $this->urlFactory);
    }

    public function createSmileyQuery(): SmileyQuery
    {
        return new SmileyQuery($this->requestFactory, $this->urlFactory);
    }
}
