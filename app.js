const express = require('express')
const config = require('./config/default')

const app = express()

const indexRouter = require('./routes/index')

app.use('/', indexRouter)

app.listen(config.port, () => {
  console.log('starting...')
})
