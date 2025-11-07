<?php declare(strict_types=1);

use MF\Faces\ValueObject\Face;
use PHPUnit\Framework\TestCase;

class FaceTest extends TestCase
{
    public function testShouldSerializeFace(): void
    {
        $smiley = '😀';
        $color = '#00B894';

        $face = new Face($smiley, $color);

        $this->assertEquals(
            [
                'smiley' => $smiley,
                'color' => $color,
            ],
            $face->jsonSerialize(),
        );
    }
}
