angular.module('mean.system')
  .factory('chat', [() => {
    /**
    * Class to implement chat functionality
    */
    class Chat {
      /**
      * Constructor to create a new instance of this class
      * @param{Object} dotEnv - Object holding our enviroment variables
      * for angular
      */
      constructor() {
        // declare fire base reference with link to our firebase database
        const config = {
          apiKey: 'AIzaSyBG4e8eTQs2nSqj1vzYnb0dGXm8vKi5NlM',
          authDomain: 'izanagi-cfh-chat.firebaseapp.com',
          databaseURL: 'https://izanagi-cfh-chat.firebaseio.com',
          storageBucket: 'izanagi-cfh-chat.appspot.com',
          messagingSenderId: '511279152310'
        };
        firebase.initializeApp(config);
        this.database = firebase.database();

        this.messageArray = [];
        this.enableListener = true;
        this.chatWindowVisible = false;
        this.unreadMessageCount = 0;
      }

      /**
      * Method to set the chat group to post
      * our messages to.
      * @param{String} group - Name of the group
      * @return{undefined}
      */
      setChatGroup(group) {
        this.chatGroup = group;
      }

      /**
      * Method to set the current chat user name
      * @param{String} name - name of the user
      * @return{undefined}
      */
      setChatUsername(name) {
        this.userName = name;
      }

      /**
      * Method to post user message to firebase
      * database.
      * @param{String} messageText - message
      * @return{undefined}
      */
      postGroupMessage(messageText) {
        const date = new Date();
        const messageTime = date.toTimeString().substr(0, 8);
        // We do not want to send empty messages
        if (messageText !== undefined && messageText.trim().length > 0) {
          // Push message to group thread on firebase
          if (this.userName !== undefined) {
            const messageObject = {
              username: this.userName,
              text: messageText,
              time: messageTime
            };
            this.database.ref(this.chatGroup)
            .push(messageObject);
          }
        }
      }

      /**
      * Method to clear our chat
      * history on firebase when
      * a game ends.
      * @return{undefined}
      */
      clearMessageHistory() {
        this.database.ref(this.chatGroup).remove();
      }

      /**
      * Method to setup  eventlistener
      * for firebase
      * @return{undefined}
      */
      listenForMessages() {
        if (!this.enableListener) {
          return;
        }
        this.database.ref(this.chatGroup).off();
        this.enableListener = false;
        this.database.ref(this.chatGroup).on('child_added', (snapshot) => {
          const message = snapshot.val();
          this.messageArray.push(message);
          this.updateUnreadMessageCount();
        });
      }

      /**
      * Method to update the uread messages count
      * @return{undefined} returns undefined
      */
      updateUnreadMessageCount() {
        if (!this.chatWindowVisible) {
          this.unreadMessageCount += 1;
        }
      }
    }
    const chat = new Chat();
    return chat;
  }]);
