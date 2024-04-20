const { response } = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { generateJWT } = require('../helpers/jwt')

const createUser = async (req, res = response) => {
  const { email, password } = req.body

  try {
    let user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario ya existe'
      })
    }
    user = new User(req.body)

    //Encriptamos la contraseña
    const salt = bcrypt.genSaltSync()
    user.password = bcrypt.hashSync(password, salt)

    //Guardamos el usuario en la base de datos
    await user.save()

    //Generate JWT
    const token = await generateJWT(user.id, user.name)

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token
    })
  } catch (error) {
    //Este error solo se muestra en el servidor
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error al registrar usuario' + error.message
    })
  }
}

const loginUser = async (req, res = response) => {
  const { email, password } = req.body

  try {
    let usuario = await User.findOne({ email })

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario no existe'
      })
    }

    //Confirmar los passwords
    const validPassword = bcrypt.compareSync(password, usuario.password)

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Invalid password'
      })
    }

    //Generar nuestro JWT
    const token = await generateJWT(usuario.id, usuario.name)
    res.status(200).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token
    })
  } catch (error) {
    //Este error solo se muestra en el servidor
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error al iniciar session: ' + error.message
    })
  }
}

const renewToken = async (req, res = response) => {
  const { uid, name } = req
  //Generar nuevo JWT y retornarlo en esta request
  const token = await generateJWT(uid, name)
  res.json({
    ok: true,
    uid,
    name,
    token
  })
}

module.exports = { createUser, loginUser, renewToken }
