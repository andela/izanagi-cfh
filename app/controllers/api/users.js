// require dependencies
const mongoose = require('mongoose');
const User = mongoose.model('User');

const users = {
  addFriend(req, res) {
    const query = req.user.id;
    const friendEmail = req.body.email;
    console.log(friendEmail, req.user.id) ;
    User.findById(query, (err, userInfo) => {
      if (err) {
        return res.status(500)
          .json({
            message: 'An Error occured while trying to find your info',
            error: err }
            );
      }
      console.log(userInfo)
      if (userInfo.friends.indexOf(friendEmail) >= 0) {
        return res.status(401).json({ message: 'You are already friends with this user' });
      }
      userInfo.friends.push(friendEmail);
      console.log(userInfo.friends);
      userInfo.save((err, result) => {
        if (err) {
          return res.status(500)
        .json({
          message: 'An error occured while trying to add this friend',
          error: err
        });
        }
        console.log('we are now friends');
        return res.status(200).json({ message: 'Friend added successfuly' });
      });
    });
  },

  searchFriends(req, res) {
    const query = req.params.email;
    console.log(query, req.user.id);
    User.findById(req.user.id, (err, user) => {
      
      const friendEmail = user.friends;
      if (err) {
        return res.send(500, { message: err.errors });
      }
      User.find({
        $and: [
          { email: { $regex: query } },
          { email: { $in: user.friends } }
        ] }, (err, friends) => {
        if (err) {
          return res.status(500).json({ message: 'could not query database', error: err });
        } else if (!friends) {
          return res.status(404).json({ message: 'You have no friends yet' });
        }
        return res.status(200).json(friends);
      });
    });
  }
};

module.exports = users;
