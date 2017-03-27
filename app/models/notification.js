/* eslint amd:true */
/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  to: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  senderId: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
});

mongoose.model('Notification', NotificationSchema);
