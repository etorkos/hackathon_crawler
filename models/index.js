var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hackathons');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var Event;
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  name: {type: String, unique: true }, //protected
  link: String,//protected
  body:   String, //changes. duh.
  location: String,
  date: { type: Date, default: Date.now }, //updates every update
  status: Number,
  tags: Array
});


Event = mongoose.model('Event', eventSchema);

module.exports = { "Event": Event};