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

$app->post('/test/[{id}]', function ($request, $response, $args) {
        $input = $request->getParsedBody();
        
        // $sql = "UPDATE tasks SET task=:task WHERE id=:id";
         // $sth = $this->db->prepare($sql);
        // $sth->bindParam("id", $args['id']);
        // $sth->bindParam("task", $input['task']);
        // $sth->execute();
        // $input['id'] = $args['id'];
        return $this->response->withJson($input);
    });

$app->get('/test', function (Request $request, Response $response) {
    $params = DB::fetchAll('SELECT * FROM `params`');
    foreach ($params as &$p) {
        $measurements = DB::fetchAll('SELECT * FROM `measurements` WHERE id_param = ' . $p['id']);
        $p['measurements'] = $measurements;
    }
    unset($p);
    $response->getBody()->write(json_encode([
        'data' => $params
    ], JSON_UNESCAPED_UNICODE));
    return $response;
});

$app->run();