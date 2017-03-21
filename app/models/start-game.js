/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
/**
 * Game Record Schema
 */
const RecordSchema = new Schema({
  gameID: String,
  players: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  completed: Boolean,
  rounds: Number,
  winner: String
});

module.exports = mongoose.model('Records', RecordSchema);
