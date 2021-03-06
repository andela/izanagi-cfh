angular.module('mean.system')
.controller('IndexController', ['$scope', '$location', '$window', '$http', 'Global', 'socket', 'game', 'AvatarService', 'dataFactory', ($scope, $location, $window, $http, Global, socket, game, AvatarService, dataFactory) => {
    $scope.global = Global;
    $scope.signupErrMsg = '';
    $scope.loginErrMsg = '';
    $scope.showEmail = $location.search().email;
    $scope.gameId = $location.search().game;

  if ($window.localStorage.getItem('token')) {
    $scope.showOptions = false;
  } else {
    $scope.showOptions = true;
  }
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

    $scope.login = () => {
       const user = {
         email: $scope.email,
         password: $scope.password
       };

       $http.post('/api/auth/login', user).then((response) => {
         if(response.data.success) {
           $window.localStorage.setItem('token', response.data.token);
           $location.path('/');
         } else {
           $scope.loginErrMsg = response.data.message;
         }
       }, (err) => {
         $scope.showError();
         $scope.error = err;
       });
     };

    $scope.logout = () => {
       $window.localStorage.removeItem('token');
        $scope.showOptions = true;
        $location.path('/');
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

        $http.post('/api/auth/signup', newuser).then((response) => {
          $window.localStorage.setItem('token', response.data.token);
          $scope.showOptions = false;
          $location.path('/#howtoplay');
        }, (err) => {
          $scope.signupErrMsg = err.data.message;
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


    if ($window.user !== null) {
      console.log($scope.email);
      const email = $scope.email;
      dataFactory.getNotifications()
      .success(function(data, status, headers, config) {
        $scope.notification = data;
      })
      .error(function (data, status, headers, config) {
        $scope.noResult = status;
      });
    }

    $scope.readNotification = function(notificationId) {
      console.log(notificationId);
      dataFactory.viewNotification(notificationId)
      .success(function(data, status, headers, config) {
        $scope.hasRead = data.read;
      })
      .error(function (data, status, headers, config) {
        $scope.noResult = status;
      });
    };

}]);
