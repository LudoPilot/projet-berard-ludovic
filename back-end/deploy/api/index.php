<?php

use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../bootstrap.php';

$app = AppFactory::create();

require_once __DIR__ . '/middleware.php';
require_once __DIR__ . '/controller.php';
require_once __DIR__ . '/route.php';

// Fonction de parsing pour supporter le format JSON https://www.slimframework.com/docs/v4/middleware/body-parsing.html
$app->addBodyParsingMiddleware();

// Run app
$app->run();
