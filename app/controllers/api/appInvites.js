const mongoose = require('mongoose');
const Notification = mongoose.model('Notification');

const Messages = {
  appNotify(req, res) {
    const email = req.body.email;
    const notification = new Notification({
      to: email,
      senderId: req.body.senderId,
      from: req.body.sender,
      link: req.body.link,
    });
    notification.save((err) => {
      if (err) {
        return res.status(500).json({ message: 'An Error occurred while sending your invite', error: err });
      }
      return res.status(200).json({ message: `Invite has been sent to ${email} successfullly` });
    });
  },

  getNotifications(req, res) {
    Notification.find({
      $and: [{ to: req.user.email }, { read: false }]
    }).sort({ _id: -1 }).limit(10)
      .exec((err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Can not get message now, try again later', error: err });
        }
        return res.status(200).json(result);
      });
  },

  viewNotification(req, res) {
    Notification.findById(req.params.notificationId, (err, notification) => {
      if (err) {
        if (err) return res.status(500).json({ message: 'An error occured while updating this data', error: err });
      }
      notification.read = true;
      notification.save((err) => {
        if (err) {
          return res.status(500).json({ message: 'An error occured while updating this data', error: err });
        }
        return res.status(200).json({ message: 'Message has been marked as read', result: notification });
      });
    });
  }
};
module.exports = Messages;
