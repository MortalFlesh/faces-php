<?php declare(strict_types=1);

use MF\Faces\App;
use Symfony\Component\HttpFoundation\Request;

require '../vendor/autoload.php';

$request = Request::createFromGlobals();
$app = new App();

$response = $app->handle($request);
$response->send();
