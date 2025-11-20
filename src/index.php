<?php declare(strict_types=1);

use MF\Faces\App;
use Symfony\Component\HttpFoundation\Request;

// disable deprecated notices
error_reporting(E_ALL & ~E_DEPRECATED);

require '../vendor/autoload.php';

$request = Request::createFromGlobals();
$app = new App();

$response = $app->handle($request);
$response->send();
