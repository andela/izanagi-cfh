angular.module('mean.system')
.controller('HeaderController', ['$scope', 'Global', 'dataFactory', function ($scope, Global, dataFactory) {
    $scope.global = Global;

    $scope.menu = [{
        "title": "Articles",
        "link": "articles"
    }, {
        "title": "Create New Article",
        "link": "articles/create"
    }];

    dataFactory.getNotifications()
    .success((data, status, headers, config) => {
      $scope.notification = data.length;
    })
    .error((data, status, headers, config) => {
      $scope.noResult = status;
    });
}]);