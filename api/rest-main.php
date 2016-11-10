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
    $params = DB::fetchAll('SELECT * FROM `params`');
    //print_r('<br>');
    foreach ($params as &$p) {
        $measurements = DB::fetchAll('SELECT * FROM `measurements` WHERE id_param = ' . $p['id']);
        $p['measurements'] = $measurements;
        // foreach ($measurements as &$m) {
            // $p['measurements']['id'] = $m['id'];
            // $p['measurements']['daytime'] = $m['daytime'];
            // $p['measurements']['value'] = $m['value'];
            // //print_r ( 'p: ' . $p['id'] . ' - m: ' . $m['id'] . ' - ' . $p['measurements']['value'] . '  <br> ');
            
        // }
        // unset($m);
    }
    unset($p);
    $response->getBody()->write(json_encode([
        'data' => $params
    ], JSON_UNESCAPED_UNICODE));
    return $response;
});

$app->run();