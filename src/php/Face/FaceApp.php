<?php declare(strict_types=1);

namespace MF\Faces\Face;

use Lmc\Cqrs\Types\QueryFetcherInterface;
use MF\Faces\Face\Service\QueryFactory;
use MF\Faces\Face\ValueObject\Face;
use MF\Faces\ValueObject\AppInterface;
use MF\Faces\ValueObject\ResponseInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class FaceApp implements AppInterface
{
    public function __construct(private QueryFactory $queryFactory, private QueryFetcherInterface $queryFetcher) {}

    public static function path(): string
    {
        return '/face';
    }

    public function getPath(): string
    {
        return self::path();
    }

    public function handle(Request $request): Response|ResponseInterface
    {
        try {
            $smiley = $this->queryFetcher->fetchAndReturn($this->queryFactory->createSmileyQuery());
            $color = $this->queryFetcher->fetchAndReturn($this->queryFactory->createColorQuery());
        } catch (\Throwable $exception) {
            return new JsonResponse([
                'error' => $exception->getMessage(),
                'type' => get_class($exception),
            ], Response::HTTP_REQUEST_TIMEOUT);
        }

        return new Face($smiley, $color);
    }
}
