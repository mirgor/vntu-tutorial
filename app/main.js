var mainApp = angular.module('MainApp', []);

mainApp.controller('MainController', ['$scope', function($scope) {
    $scope.answer = ' - ';

    $scope.setAnswer = function(answer) {
        $scope.answer = answer;
    };
}]);

