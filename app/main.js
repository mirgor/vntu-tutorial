var mainApp = angular.module('MainApp', []);

mainApp.controller('MainController', ['$scope', function($scope) {
    $scope.answer = ' - ';

    $scope.setAnswer = function(answer) {
        $scope.answer = answer;
    };
    
    $scope.saveValue = function(value){
        
    };

    // -- date --
    $scope.CurrentDate = new Date();

    $scope.dayToCurrent = function(firstDate){
        $scope.dayToCurrentDate = "";
        var date2 = new Date();
        var date1 = new Date(firstDate);
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        $scope.dayToCurrentDate = Math.ceil(timeDiff / (1000 * 3600 * 24));
    };


    
}]);

mainApp.controller('StoreController', function(){

    this.data = [
        {
            id:1,
            name: 'Холодна вода',
            measurements : [
                {daytime : "2016-09-01", value : 92.75},
                {daytime : "2016-08-01", value : 75.11},
                {daytime : "2016-07-01", value : 68.35},
                {daytime : "2016-06-01", value : 60.12},
            ]
        },
        {
            id:2,
            name: 'Гаряча вода',
            measurements : [
                {daytime : "2016-09-28", value : 92.75},
                {daytime : "2016-08-01", value : 75.11},
                {daytime : "2016-07-01", value : 68.35},
                {daytime : "2016-06-01", value : 60.12},
            ]
        },
        {
            id:3,
            name: 'Електроенергія',
            measurements : [
                {daytime : "2016-09-01", value : 92.75},
                {daytime : "2016-08-01", value : 75.11},
                {daytime : "2016-07-01", value : 68.35},
                {daytime : "2016-06-01", value : 60.12},
            ]
        },
        {
            id:4,
            name: 'Газ',
            measurements : [
                {daytime : "2016-10-01", value : 101.15},
                {daytime : "2016-09-01", value : 92.75},
                {daytime : "2016-08-01", value : 75.11},
                {daytime : "2016-07-01", value : 68.35},
                {daytime : "2016-06-01", value : 60.12},
            ]
        }
        ]
});
