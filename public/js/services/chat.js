angular.module('mean.system')
  .factory('chat', ['env', function (env) {
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
        this.firebase = new Firebase(env.FIREBASE_URL);
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
        const messageTime = date.toTimeString().substr(0, 5);
        // We do not want to send empty messages
        if (messageText !== undefined && messageText.trim().length > 0) {
          // Push message to group thread on firebase
          const messageObject = {
            username: this.userName,
            text: messageText,
            time: messageTime
          };
          this.firebase.child(this.chatGroup)
            .push(messageObject);
        }
      }

      /**
      * Method to clear our chat
      * history on firebase when
      * a game ends.
      * @return{undefined}
      */
      clearMessageHistory() {
        this.firebase.child(this.chatGroup).remove();
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
        this.firebase.child(this.chatGroup).off();
        this.enableListener = false;
        this.firebase.child(this.chatGroup).on('child_added', (snapshot) => {
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
