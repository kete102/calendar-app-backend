const { response } = require('express')
const Event = require('../models/Event')

const getEvent = async (req, res = response) => {
  const events = await Event.find().populate('user', 'name')

  return res.status(200).json({
    ok: true,
    events: events
  })
}

const createEvent = async (req, res = response) => {
  //Check event
  const event = new Event(req.body)

  try {
    //Hay que especificar el usuario para poder guardar
    event.user = req.uid
    const savedEvent = await event.save()

    res.status(200).json({
      ok: true,
      event: savedEvent
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: `An error ocurred: ${error}`
    })
  }
}

const updateEvent = async (req, res = response) => {
  const eventId = req.params.id

  const uid = req.uid

  try {
    const event = await Event.findById(eventId)

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "The event doesn't exists"
      })
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'Not authorized to edit this event'
      })
    }

    const eventToUpdate = {
      ...req.body,
      user: uid
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, eventToUpdate, {
      new: true
    })

    res.json({
      ok: true,
      event: `Event updated: ${updatedEvent}`
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      ok: false,
      msg: 'An error ocurred'
    })
  }
}

const deleteEvent = async (req, res = response) => {
  const eventId = req.params.id

  const uid = req.uid

  try {
    const event = await Event.findById(eventId)

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "The event doesn't exists"
      })
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'Not authorized to edit this event'
      })
    }

    await Event.findByIdAndDelete(eventId)

    res.json({
      ok: true
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      ok: false,
      msg: 'An error ocurred'
    })
  }
}

module.exports = { getEvent, createEvent, updateEvent, deleteEvent }
