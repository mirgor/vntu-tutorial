<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require 'vendor/autoload.php';
require 'db.php';

DB::init('mysql:dbname=greenreminder;host=127.0.0.1;port=3306', 'root', '1');

$app = new \Slim\App;

$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

$app->add(function ($req, $res, $next) {
    $response = $next($req, $res);
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
});

$app->get('/test', function (Request $request, Response $response) {
    $rows = DB::fetchAll('SELECT * FROM `params`');
    $response->getBody()->write('{"data":'.json_encode($rows).'}');
    return $response;
});

$app->run();