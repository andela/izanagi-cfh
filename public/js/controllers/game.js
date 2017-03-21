angular.module('mean.system')
.controller('GameController', ['$scope', 'game', '$timeout', '$location', 'MakeAWishFactsService', '$dialog', 'playerSearch', 'invitePlayer', function ($scope, game, $timeout, $location, MakeAWishFactsService, $dialog, playerSearch, invitePlayer) {
    $scope.hasPickedCards = false;
    $scope.winningCardPicked = false;
    $scope.showTable = false;
    $scope.modalShown = false;
    $scope.game = game;
    $scope.pickedCards = [];
    var makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
    $scope.makeAWishFact = makeAWishFacts.pop();
    $scope.searchResults = [];
    $scope.inviteeUserName = '';
    $scope.invitedPlayerName = '';
    $scope.invitedPlayers = [];
    $scope.wrongEmail = [];
    $scope.chat = game.gameChat;


    /**
    * Method to scroll the chat thread to the bottom
    * so user can see latest message when messages overflow
    * @return{undefined}
    */
    const scrollChatThread = () => {
      const chatResults = document.getElementById('results');
      chatResults.scrollTop = chatResults.scrollHeight;
    };

    $scope.$watchCollection('chat.messageArray', (newValue, oldValue) => {
      $timeout(() => {
        scrollChatThread();
      }, 100);
    });

    /**
    * Method to send messages
    * @param{String} userMessage - String containing the message to be sent
    * @return{undefined}
    */
    $scope.sendMessage = (userMessage) => {
      $scope.chat.postGroupMessage(userMessage);
      document.getElementsByClassName('emoji-wysiwyg-editor')[0].innerHTML = '';
    };

    /**
    * Method to send messages when Enter button is pressed
    * @param{String} userMessage - String containing the message to be sent
    * @return{undefined}
    */
    $scope.keyPressed = function ($event) {
      const keyCode = $event.which || $event.keyCode;
      if (keyCode === 13) {
        $scope.sendMessage($scope.chatMessage);
      }
    };

    /**
    * Method to show chat window
    * @param{String} userMessage - String containing the message to be sent
    * @return{undefined}
    */
    $scope.showChat = function () {
      $scope.chat.chatWindowVisible = !$scope.chat.chatWindowVisible;
      // enableChatWindow;
      if ($scope.chat.chatWindowVisible) {
        $scope.chat.unreadMessageCount = 0;
      }
    };

    $scope.pickCard = function(card) {
      if (!$scope.hasPickedCards) {
        if ($scope.pickedCards.indexOf(card.id) < 0) {
          $scope.pickedCards.push(card.id);
          if (game.curQuestion.numAnswers === 1) {
            $scope.sendPickedCards();
            $scope.hasPickedCards = true;
          } else if (game.curQuestion.numAnswers === 2 &&
            $scope.pickedCards.length === 2) {
            //delay and send
            $scope.hasPickedCards = true;
            $timeout($scope.sendPickedCards, 300);
          }
        } else {
          $scope.pickedCards.pop();
        }
      }
    };

    $scope.pointerCursorStyle = function() {
      if ($scope.isCzar() && $scope.game.state === 'waiting for czar to decide') {
        return {'cursor': 'pointer'};
      } else {
        return {};
      }
    };

    $scope.sendPickedCards = function() {
      game.pickCards($scope.pickedCards);
      $scope.showTable = true;
    };

    $scope.cardIsFirstSelected = function(card) {
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[0];
      } else {
        return false;
      }
    };

    $scope.cardIsSecondSelected = function(card) {
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[1];
      } else {
        return false;
      }
    };

    $scope.firstAnswer = function($index){
      if($index % 2 === 0 && game.curQuestion.numAnswers > 1){
        return true;
      } else{
        return false;
      }
    };

    $scope.secondAnswer = function($index){
      if($index % 2 === 1 && game.curQuestion.numAnswers > 1){
        return true;
      } else{
        return false;
      }
    };

    $scope.showFirst = function(card) {
      return game.curQuestion.numAnswers > 1 && $scope.pickedCards[0] === card.id;
    };

    $scope.showSecond = function(card) {
      return game.curQuestion.numAnswers > 1 && $scope.pickedCards[1] === card.id;
    };

    $scope.isCzar = function() {
      return game.czar === game.playerIndex;
    };

    $scope.isPlayer = function($index) {
      return $index === game.playerIndex;
    };

    $scope.isCustomGame = function() {
      return !(/^\d+$/).test(game.gameID) && game.state === 'awaiting players';
    };

    $scope.isPremium = function($index) {
      return game.players[$index].premium;
    };

    $scope.currentCzar = function($index) {
      return $index === game.czar;
    };

    $scope.winningColor = function($index) {
      if (game.winningCardPlayer !== -1 && $index === game.winningCard) {
        return $scope.colors[game.players[game.winningCardPlayer].color];
      } else {
        return '#f9f9f9';
      }
    };

    $scope.pickWinning = function(winningSet) {
      if ($scope.isCzar()) {
        game.pickWinning(winningSet.card[0]);
        $scope.winningCardPicked = true;
      }
    };

    $scope.winnerPicked = function() {
      return game.winningCard !== -1;
    };

    $scope.startGame = function() {
      // game.startGame();
       if (game.players.length >= game.playerMinLimit) {
         game.startGame();
       } else {
         $('#playerMinimumAlert').modal('show');
       }
    };

    $scope.abandonGame = function() {
      game.leaveGame();
      $location.path('/');
    };

    // Catches changes to round to update when no players pick card
    // (because game.state remains the same)
    $scope.$watch('game.round', function() {
      $scope.hasPickedCards = false;
      $scope.showTable = false;
      $scope.winningCardPicked = false;
      $scope.makeAWishFact = makeAWishFacts.pop();
      if (!makeAWishFacts.length) {
        makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
      }
      $scope.pickedCards = [];
    });

    // In case player doesn't pick a card in time, show the table
    $scope.$watch('game.state', function() {
      if (game.state === 'waiting for czar to decide' && $scope.showTable === false) {
        $scope.showTable = true;
      }
    });

    $scope.$watch('game.gameID', function() {
      if (game.gameID && game.state === 'awaiting players') {
        if (!$scope.isCustomGame() && $location.search().game) {
          // If the player didn't successfully enter the request room,
          // reset the URL so they don't think they're in the requested room.
          $location.search({});
        } else if ($scope.isCustomGame() && !$location.search().game) {
          // Once the game ID is set, update the URL if this is a game with friends,
          // where the link is meant to be shared.
          $location.search({game: game.gameID});
          if(!$scope.modalShown){
            setTimeout(function(){
              var link = document.URL;
              $('#lobby-how-to-play').text(link).hide();
              $('#oh-el').hide();
              $('#searchContainer').show();
            }, 200);
            $scope.modalShown = true;
          }
        }
      }
    });


    $scope.sendInvite = () => {
      if (!$scope.invitedPlayers.includes($scope.inviteeEmail)) {
        if ($scope.invitedPlayers.length >= game.playerMaxLimit - 1) {
          $('#playerMaximumAlert').modal('show');
        }
        invitePlayer.sendMail($scope.inviteeEmail, document.URL).then((data) => {
          if (data instanceof Array) {
            $scope.invitedPlayers.push($scope.inviteeEmail);
            $scope.invitedPlayerName = $scope.inviteeEmail;
            $scope.searchResults = [];
            $scope.inviteeEmail = '';
            $scope.inviteeUserName = '';
            $scope.wrongEmail = '';
          } else {
            $scope.invitedPlayerName = [];
            $scope.wrongEmail = $scope.inviteeEmail;
          }
        });
      } else {
        $('#playerAlreadyInvited').modal('show');

        $scope.searchResults = [];
        $scope.inviteeUserEmail = '';
        $scope.inviteeUserName = '';
      }
    };

    $scope.playerSearch = (inviteeEmail) => {
      if (inviteeEmail !== '') {
        playerSearch.getPlayers(inviteeEmail).then((data) => {
          $scope.searchResults = data;
        });
      } else {
        $scope.searchResults = [];
      }
    }

    $scope.selectEmail = (selectedEmail) => {
      $scope.inviteeEmail = selectedEmail;
      $scope.searchResults = [];
    }

  $scope.startNextRound = () => {
    if ($scope.isCzar()) {
      game.startNextRound();
    }
  };
  $scope.flipCards = () => {
    const card = angular.element(document.getElementsByClassName('card-stack'));
    card.addClass('slide');
    $timeout(() => {
      $scope.startNextRound();
      card.removeClass('slide');
    }, 4000);
  };


    if ($location.search().game && !(/^\d+$/).test($location.search().game)) {
      console.log('joining custom game');
      game.joinGame('joinGame',$location.search().game);
    } else if ($location.search().custom) {
      game.joinGame('joinGame',null,true);
    } else {
      game.joinGame();
    }

    $scope.tour = () => {
      console.log('Taking you on a tour....');

      const tour = {
        id: "hello-hopscotch",
        steps: [
          {
            title: "Timer",
            content: "People are choosing their answers...",
            target: "timer-container",
            placement: "right"
          },
          {
            title: "Finding Players",
            content: "You have to be a minimum of 3 to play the game.",
            target: "loading-container",
            placement: "top"
          },
          {
            title: "How to Play",
            content: "Here you can learn all about how to play the game.",
            target: "lobby-how-to-play",
            placement: "right"
          },
          {
            title: "Avatar",
            content: "Check your Avatar here",
            target: "avatar_",
            placement: "left"
          },
          {
            title: "Chat Panel",
            content: "Here you can chat with fellow players.",
            target: "chatwindow",
            placement: "top"
          },
          {
            title: "Abandon Game",
            content: "Here you can leave the game anytime you wish",
            target: "abandon-game-button",
            placement: "left"
          },
          {
            title: "You're all set!",
            content: "Now go kick some ass.",
            target: "second-word",
            placement: "bottom"
          }
        ]
      };

      // Start the tour!
      hopscotch.startTour(tour);
    }

    //$scope.tour();

}]);
