var app = angular.module('service', []);

app.factory('parametersSrv', function ($resource){
    return $resource('http://localhost:8088/api/db-service.php/params/:id',
    {'id': '@id'}, {
        'update': {method: 'PUT'}
    });
});
    