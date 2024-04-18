const express = require('express')
const { dbConnection } = require('./database/config')
require('dotenv').config()
const cors = require('cors')

// Create Express server
const app = express()

//Database
dbConnection()

//CORS
app.use(cors())

// Public routes`
app.use(express.static('public'))

//Lectura y parseo del body
app.use(express.json())

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// Listen petitions
app.listen(process.env.PORT, () => {
  console.log(`Petitions server listening on port ${process.env.PORT}`)
})
