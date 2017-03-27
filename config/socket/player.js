function Player(socket) {
  this.socket = socket;
  this.hand = [];
  this.points = 0;
  this.username = null;
  this.premium = 0;
  this.avatar = null;
  this.userID = null;
  this.color = null;
  this.id = null;
  this.email = null;
}

module.exports = Player;