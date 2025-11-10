<?php declare(strict_types=1);

use MF\Faces\Color\ValueObject\Color;
use MF\Faces\Face\ValueObject\Face;
use MF\Faces\Smiley\ValueObject\Smiley;
use PHPUnit\Framework\TestCase;

class FaceTest extends TestCase
{
    public function testShouldSerializeFace(): void
    {
        $smiley = '😀';
        $color = '#00B894';

        $face = new Face(new Smiley($smiley), new Color($color));

        $this->assertEquals(
            [
                'smiley' => $smiley,
                'color' => $color,
            ],
            $face->jsonSerialize(),
        );
    }
}
