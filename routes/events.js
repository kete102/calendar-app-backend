/* CRUD */

/* /api/events */

// Todas estas rutas tiene que estas validadas con el jwt
const { Router } = require('express')
const router = Router()
const { fieldsValidator } = require('../middlewares/fields-validator')

const { validateJWT } = require("../middlewares/validate-jwt")
const { getEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/events')
const { check } = require('express-validator')
const { isDate } = require('../helpers/isDate')


// Private Routes
router.use(validateJWT)

// Get events
router.get('/', getEvent)

// Create new Event
router.post('/',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('start', 'Start date is required').custom(isDate),
    check('end', 'End date is required').custom(isDate),
    fieldsValidator
  ],
  createEvent
)

// Update Event
router.put('/:id', updateEvent)

// Delete Event
router.delete('/:id', deleteEvent)

module.exports = router
