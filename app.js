const express = require('express')
const bodyParser = require('body-parser')
const config = require('./config/default')

const app = express()
const http = require('http').createServer(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const indexRouter = require('./routes/index')

app.use('/', indexRouter)

http.listen(config.port, () => {
  console.log('starting...')
})

const socketProcess = require('./socket')
socketProcess(http)
