const mongoose = require('mongoose');

const User = mongoose.model('User');

/**
 * search for users from the database base on name
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} returns JSON object of users
 */
exports.users = (req, res) => {
  const query = req.params.inviteeUserName || '';
  User.find({ name: new RegExp(query, 'i') }).limit(10)
    .exec((err, result) => {
      if (err) {
        return res.json(err);
      }
      res.json(result);
    });
};
