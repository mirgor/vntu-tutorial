function router ($routeProvider) {
  $routeProvider
  .when('/', {
      templateUrl: 'views/main.html'
  })
  .when('/parameters', {
      templateUrl: 'views/parameters.html'
  })
  .when('/about', {
      templateUrl: 'views/about.html'
  })
  .when('/aslubsky', {
      templateUrl: 'views/aslubsky.html'
  })
  .otherwise({
    redirectTo: '/'
  });
}


var mainApp = angular
    .module('MainApp', ['ngResource', 'ngRoute'])
    .config(router);


dataPrepare = function(parameters){
    
    parameters.forEach(function(item, i, parameters) {
        console.log('dataPrepare = ' + item.name);
        var arr = item.measurements;
        
        item.chartX = ['x'];
        item.chartValues = ['value'];
        item.chartDelta = ['delta'];
        arr.forEach(function(item2, j, arr) {
            // console.log( j + ": " + item.value + " (массив:" + ( (arr[j+1]) ? arr[j+1].value : 0 ) + ")" );
            item2.delta = Math.round ( (item2.value - ( (arr[j+1]) ? arr[j+1].value : item2.value ))*100 ) / 100 ; // Math.round (x*100) / 100 
            item.chartX.splice(1, 0, item2.daytime);
            item.chartValues.splice(1, 0, item2.value);
            item.chartDelta.splice(1, 0, item2.delta); 
        });
        console.log('item.chartX', item.chartX);
        console.log('item.chartValues', item.chartValues);
        console.log('item.chartDelta', item.chartDelta);
    })
};

mainApp.directive('myChart', [function(){
    return {
        restrict: 'A',
        scope: {
            chartData: '='
        },
        link: function ($scope, $element, $attrs) {
  
            console.log('$scope', $scope.chartData);
            
            var chart = c3.generate({
                bindto: $element[0],
                data: {
                    x: 'x',
                    columns: [
                        $scope.chartData.chartX,
                        $scope.chartData.chartValues,
                        $scope.chartData.chartDelta
                    ],
                    axes: {
                        value: 'y',
                        delta: 'y2'
                    },
                    types: {
                        value: 'area',
                        delta: 'line'   
                        // 'line', 'spline', 'step', 'area', 'area-step', 'area-spline'
                    },
                    names: {
                        value: 'Показник',
                        delta: 'Витрата'
                    }
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%y-%m-%d',
                            rotate: 60
                        }
                    },
                    y: {
                        label: 'Показник'
                    },
                    y2: {
                        show: true,
                        label: 'Витрата'    
                    }
                }
            });
        }
    };
}]);

//------------------------------------------------------------------------
mainApp.controller('StoreController',['$scope', function($scope){
    var data2;
    
    $scope.newvalue = 0;
    $scope.parameters = [
        {
            id:1,
            name : 'Холодна вода',
            measurements : [
                {daytime : "2016-10-17", value : 25.30},
                {daytime : "2016-09-03", value : 22.30},
                {daytime : "2016-08-04", value : 20.15},
                {daytime : "2016-07-01", value : 20.05},
                {daytime : "2016-06-01", value : 10.05},
                {daytime : "2016-05-01", value : 8.00},
                {daytime : "2016-04-01", value : 6.00}
            ]
        },
        {
            id:2,
            name: 'Гаряча вода',
            measurements : [
                {daytime : "2016-09-28", value : 92.75},
                {daytime : "2016-08-01", value : 75.11},
                {daytime : "2016-07-01", value : 68.35},
                {daytime : "2016-06-01", value : 60.12}
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
                {daytime : "2016-05-01", value : 50.12}
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
                {daytime : "2016-06-01", value : 60.12}
            ]
        }
        ];
        
    data2 = dataPrepare($scope.parameters);
    
    $scope.dayToCurrentDate = function(parameter){
        moment.locale('uk');
        var $c = moment(parameter.measurements[0].daytime,'YYYY-MM-DD').endOf('day').fromNow();
        return $c;
    };

    $scope.addMeasurement = function(parameter){
        var curDaytime;
        curDaytime = moment().format('YYYY-MM-DD');
        
        if (parameter.measurements[0].daytime != curDaytime){
            parameter.measurements.unshift({
                daytime:curDaytime,
                value: parameter.newvalue,
                delta: (parameter.newvalue - parameter.measurements[0].value)
            });
        } else {
            parameter.measurements[0].delta = (parameter.newvalue - parameter.measurements[1].value);
            parameter.measurements[0].value = parameter.newvalue;
            
        }
        //как заставить обновиться $scope?
        parameter.newvalue = 0;
        parameter.$edit = false;
    }
}]);

    // values list

mainApp.factory('PostModelParameters', ['$resource', function ($resource) {
    return $resource('http://localhost:8088/api/rest-parameters.php/test/:id', {'id': '@id'}, {});
}]);
    
mainApp.controller('ParametersController', ['$scope', 'PostModelParameters', function($scope, PostModelParameters) {
    $scope.answer = ' - ';

    $scope.setAnswer = function(answer) {
        console.log('setAnswer', res.data);
        $scope.answer = answer;
    };
    
    $scope.getPosts = function (answer) {
        PostModelParameters.get(function(res) {
            console.log('res: ', res);
            $scope.rows = res;
        });
    };
    
    $scope.saveValue = function(value){
        
    };
}]);
    
    // aslubsky example

mainApp.factory('PostModel', ['$resource', function ($resource) {
    return $resource('http://localhost:8088/api/rest.php/posts/:id', {'id': '@id'}, {});
}]);

mainApp.controller('MainController', ['$scope', 'PostModel', function($scope, PostModel) {
    $scope.answer = ' - ';

    $scope.setAnswer = function(answer) {
        $scope.answer = answer;
    };
    
    $scope.getPosts = function (answer) {
        PostModel.get(function(res) {
            console.log('res = = ', res.data);
            $scope.posts = res.data;
        });
    };
    
    $scope.saveValue = function(value){
        
    };

        
}]);
