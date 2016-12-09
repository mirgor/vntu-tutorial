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

$app->post('/params', function ($request, $response, $args) {
        $input = $request->getParsedBody();
        $sql = "INSERT INTO `params` (`name`) VALUES ('" . $input['name'] . "');";
        $params = DB::exec($sql);
        return $this->response->true;
    });

$app->get('/params', function (Request $request, Response $response) {
    $params = DB::fetchAll('SELECT * FROM `params`');
    $response->getBody()->write(json_encode([
        'data' => $params
    ], JSON_UNESCAPED_UNICODE));
    return $response;
});

$app->get('/params/[{id}]', function (Request $request, Response $response, $args) {
    $params = DB::fetch('SELECT * FROM `params` WHERE id_param = ' . $args['id']  );
    $response->getBody()->write(json_encode([
        'data' => $params
    ], JSON_UNESCAPED_UNICODE));
    return $response;
});

$app->put('/params/[{id}]', function ($request, $response, $args) {
        $input = $request->getParsedBody();
        $sql = "UPDATE `params` SET `name`='" . $input['name'] . "' WHERE  `id`=" . $args['id'] . ";";
        $params = DB::exec($sql);
        $input['id'] = $args['id'];
        return $this->response->withJson($input);
    });

$app->delete('/params/[{id}]', function ($request, $response, $args) {
        $input = $request->getParsedBody();
        $sql = "DELETE FROM `params` WHERE  `id`=" . $args['id'] . ";";
        $params = DB::exec($sql);
        return $this->response->true;
    });   
    
    
    
    


$app->run();