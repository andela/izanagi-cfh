angular.module('mean.system')
    .factory('dataFactory', ['$http', function ($http) {
      const dataFactory = {};

      dataFactory.addFriend = playerData => $http({
        method: 'POST',
        url: '/api/users/friends',
        headers: { 'Content-Type': 'application/json' },
        data: {
          email: playerData.email
        }
      });

      dataFactory.searchUsers = (word) => {
        const url = `/api/users/search/friends/${word}`;
        return $http.get(url);
      };

      dataFactory.sendAppInvites = inviteData => $http({
        method: 'POST',
        url: '/api/users/friends/send-invites',
        headers: { 'Content-Type': 'application/json' },
        data: {
          email: inviteData.email,
          link: inviteData.link,
          sender: inviteData.sender,
          senderId: inviteData.senderId
        }
      });
      dataFactory.getNotifications = () => $http.get('/api/users/get-notifications');


      dataFactory.viewNotification = notificationId => $http.put(`/api/users/notifications/${notificationId}`);


      return dataFactory;
    }]);
