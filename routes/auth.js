/*
    Rutas de Usuario / Auth
    host + /api/auth
*/

const { Router } = require('express')
const router = Router()
const { check } = require('express-validator')
const { createUser, loginUser, renewToken } = require('../controllers/auth')
const { fieldsValidator } = require('../middlewares/fields-validator')
const { validateJWT } = require('../middlewares/validate-jwt.js')

router.post(
  '/register',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe de tener 6 caracteres').isLength({
      min: 6
    }),
    fieldsValidator
  ],
  createUser
)

router.post(
  '/',
  [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe de tener 6 caracteres').isLength({
      min: 6
    }),
    fieldsValidator
  ],
  loginUser
)

router.get('/renew', validateJWT, renewToken)

module.exports = router
