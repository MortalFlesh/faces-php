<?php declare(strict_types=1);

namespace MF\Faces\Face\Service;

use Lmc\Cqrs\Types\Decoder\ResponseDecoderInterface;
use MF\Faces\Color\ValueObject\Color;
use MF\Faces\Face\Query\ColorQuery;
use MF\Faces\Face\Query\SmileyQuery;
use MF\Faces\Smiley\ValueObject\Smiley;

/**
 * Decodes response from ColorQuery or SmileyQuery into Color or Smiley value object
 *
 * @phpstan-implements ResponseDecoderInterface<array, Color|Smiley>
 */
class QueryDecoder implements ResponseDecoderInterface
{
    public function supports(mixed $response, mixed $initiator): bool
    {
        return is_array($response) && ($initiator instanceof ColorQuery || $initiator instanceof SmileyQuery);
    }

    public function decode(mixed $response): mixed
    {
        return array_key_exists('smiley', $response)
            ? new Smiley($response['smiley'])
            : new Color($response['color']);
    }
}
