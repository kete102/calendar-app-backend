const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EventModel = new Schema({
  title: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})
//Sobreescribir el toJSON method del model

EventModel.method('toJSON', function() {
  const { __v, _id, ...object } = this.toObject()

  object.id = _id

  return object
})
const Event = mongoose.model("Event", EventModel)
module.exports = Event
