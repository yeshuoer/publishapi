const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const pubRouter = require('./routes/pub')

app.use(bodyParser.json())
app.use((req, res, next) => {
  req.io = io
  next()
})

app.use('/pub', pubRouter)

http.listen(3000, () => {
  console.log('listening...')
})
