'use strict';

angular.module('wodgenApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.wods = [];
    $scope.newWod = {};

    $scope.addWod = function() {
      if ($scope.newWod) {
        $http.post('/api/wods/add', $scope.newWod);
        $scope.wods.push($scope.newWod);
        $scope.newWod = {};
        $scope.adding = false;
      }
    };


    $http.get('/api/wods').success(function(wods) {
      $scope.wods = wods;
    });


  });
