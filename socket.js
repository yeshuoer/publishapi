const express = require('express')
const config = require('./config/default')
const path = require('path')
const shell = require('shelljs')

const socketProcess = function (http) {
  let repoPath = ''
  const io = require('socket.io')(http)
  let currentBranch = shell.exec('git symbolic-ref --short -q HEAD')
  io.on('connection', socket => {
    console.log('hehe connected')
    socket.emit('which repo')
    socket.on('repo', repo => {
      if (repo === 'test') {
        repoPath = config.repoPath
      }
    })
    socket.on('disconnect', () => {
      console.log('websocket disconnect')
    })
  })
}

module.exports = socketProcess