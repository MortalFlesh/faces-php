<?php declare(strict_types=1);

use Lmc\CodingStandard\Set\SetList;
use PhpCsFixer\Fixer\FunctionNotation\PhpdocToParamTypeFixer;
use Symplify\EasyCodingStandard\Config\ECSConfig;

return ECSConfig::configure()
    ->withPaths([
        __DIR__ . '/src',
        __DIR__ . '/tests',
    ])
    ->withRootFiles()
    ->withSets([
        SetList::ALMACAREER,
    ])
    ->withSkip([]);
