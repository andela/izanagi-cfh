angular.module('mean.system')
.controller('IndexController', ['$scope', '$location', '$http', 'Global', 'socket', 'game', 'AvatarService', ($scope, $location, $http, Global, socket, game, AvatarService) => {
    $scope.global = Global;

    $scope.playAsGuest = function() {
      game.joinGame();
      $location.path('/app');
    };

    $scope.showError = function() {
      if ($location.search().error) {
        return $location.search().error;
      } else {
        return false;
      }
    };

    $scope.signup = () => {
      if (!$scope.name || !$scope.email || !$scope.password) {
        const error = {
          data: { message: 'Please fill in your username, email and password' }
        };
        $scope.showError();
        $scope.error = error;
      } else {
        const newuser = {
          name: $scope.name,
          email: $scope.email,
          password: $scope.password
        };

        $http.post('/api/auth/signup', newuser).then(() => {
          $location.path('/app');
        }, (err) => {
          $scope.showError();
          $scope.error = err;
        });
      }
    };

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function(data) {
        $scope.avatars = data;
      });

}]);