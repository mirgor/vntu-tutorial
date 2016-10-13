var mainApp = angular.module('MainApp', ['ngResource']);

mainApp.factory('PostModel', ['$resource', function ($resource) {
    return $resource('http://localhost:8088/api/rest.php/posts/:id', {'id': '@id'}, {});
}]);


mainApp.controller('MainController', ['$scope', 'PostModel', function ($scope, PostModel) {
    $scope.answer = ' - ';

    $scope.setAnswer = function (answer) {
        $scope.answer = answer;
    };

    $scope.getPosts = function (answer) {
        PostModel.get(function(res) {
            console.log('res', res.data);
            $scope.posts = res.data;
        });
    };
}]);