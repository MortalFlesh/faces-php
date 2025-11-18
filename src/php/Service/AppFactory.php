<?php declare(strict_types=1);

namespace MF\Faces\Service;

use Buzz\Client\Curl;
use Lmc\Cqrs\Handler\QueryFetcher;
use Lmc\Cqrs\Http\Decoder\HttpMessageResponseDecoder;
use Lmc\Cqrs\Http\Decoder\StreamResponseDecoder;
use Lmc\Cqrs\Http\Handler\HttpQueryHandler;
use Lmc\Cqrs\Types\Decoder\JsonResponseDecoder;
use MF\Faces\Color\ColorApp;
use MF\Faces\Face\FaceApp;
use MF\Faces\Face\Service\QueryDecoder;
use MF\Faces\Face\Service\QueryFactory;
use MF\Faces\Info\InfoApp;
use MF\Faces\Smiley\SmileyApp;
use MF\Faces\ValueObject\AppInterface;
use Nyholm\Psr7\Factory\Psr17Factory;

class AppFactory
{
    public function __construct(private Environment $environment) {}

    public function createFaceApp(): AppInterface
    {
        $httpFactory = new Psr17Factory();
        $httpClient = new Curl($httpFactory, [
            'timeout' => 2,
        ]);

        $urlFactory = new UrlFactory($this->environment);

        $queryFactory = new QueryFactory($httpFactory, $urlFactory);
        $queryFetcher = new QueryFetcher(false, null, null, [
            new HttpQueryHandler($httpClient),
        ], [
            new HttpMessageResponseDecoder(),
            new StreamResponseDecoder(),
            new JsonResponseDecoder(),
            new QueryDecoder(),
        ]);

        return new FaceApp($queryFactory, $queryFetcher);
    }

    public function createSmileyApp(): AppInterface
    {
        return new SmileyApp($this->environment);
    }

    public function createColorApp(): AppInterface
    {
        return new ColorApp($this->environment);
    }

    public function createInfoApp(): AppInterface
    {
        return new InfoApp($this->environment);
    }
}
