var app = angular.module('controller', []);

app.controller('parametersController', 
    ['$scope', 'parametersSrv', function($scope, parametersSrv) {

    function getAll() {
        parametersSrv.get(function(res) {
            console.log('getAll-res: ', res);
            $scope.rows = res;
        });
    };
  
    $scope.getParameters = function(value){
        getAll();
    }
            
    
    $scope.saveParameter = function(value){
        value.$edit = false;
        var obj = new parametersSrv(value);
        if (value.id === undefined) {
            obj.$save(function(res){
                console.log('res: ', res);
            });
        } else {
            obj.$update(function(res){
                console.log('res: ', res);
            });
        }
    };
    
    $scope.removeParameter = function (value){
        var r = confirm("Are you sure delete this ? ");
        var obj = new parametersSrv(value);
        if (r === true) {
            obj.$delete(function (res) {
                getAll();
                console.log('res: ', res);
                alert('Delete Data Success');
            });
        } else {
            getAll();
        }
    };
    
}]);
