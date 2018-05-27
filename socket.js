const express = require('express')
const config = require('./config/default')
const path = require('path')
const shell = require('shelljs')

const eventFunc = function (socket, eventName, shellData) {
  socket.emit(eventName, {
    code: shellData.code,
    stdout: shellData.stdout,
    stderr: shellData.stderr
  })
}

const socketProcess = function (http) {
  let messageList = []
  let repoPath = ''
  let pubPath = ''
  let gitBranch
  let gitCheckoutDev
  let gitPullOriginDev
  let gitCheckoutMaster
  let gitMergeDev
  let npmBuild
  let copyToDist
  let gitPullOriginMaster
  let gitAddDist
  let gitCommitDist
  let gitPushDist
  const io = require('socket.io')(http)
  io.on('connection', socket => {
    socket.emit('which repo')
    // 选择要发布的库
    socket.on('repo', repo => {
      if (repo === 'test') {
        repoPath = config.repoPath
        pubPath = config.pubPath
      }
      // git branch
      shell.cd(repoPath)
      gitBranch = shell.exec('git symbolic-ref --short -q HEAD')
      eventFunc(socket, 'git branch', gitBranch)
    })
    // git checkout dev
    socket.on('git checkout dev', data => {
      gitCheckoutDev = shell.exec('git checkout dev')
      eventFunc(socket, 'git checkout dev', gitCheckoutDev)
    })
    // git pull repo
    socket.on('git pull origin dev', data => {
      gitPullOriginDev = shell.exec('git pull origin dev')
      eventFunc(socket, 'git pull origin dev', gitPullOriginDev)
    })
    // git checkout master
    socket.on('git checkout master', data => {
      gitCheckoutMaster = shell.exec('git checkout master')
      eventFunc(socket, 'git checkout master', gitCheckoutMaster)
    })
    // git merge dev
    socket.on('git merge dev', data => {
      gitMergeDev = shell.exec('git merge dev')
      eventFunc(socket, 'git merge dev', gitMergeDev)
    })
    // npm build
    socket.on('npm build', data => {
      npmBuild = shell.exec('npm run build')
      eventFunc(socket, 'npm build', npmBuild)
    })
    // copy to dist
    socket.on('copy to dist', data => {
      shell.cd(pubPath)
      copyToDist = shell.cp('-r', path.join(repoPath, './*'), pubPath)
      eventFunc(socket, 'copy to dist', copyToDist)
    })
    // git pull origin master
    socket.on('git pull origin master', data => {
      gitPullOriginMaster = shell.exec('git pull origin master')
      eventFunc(socket, 'git pull origin master', gitPullOriginMaster)
    })
    // git add dist
    socket.on('git add dist', data => {
      gitAddDist = shell.exec('git add .')
      eventFunc(socket, 'git add dist', gitAddDist)
    })
    // git commit dist
    socket.on('git commit dist', data => {
      let time = new Date()
      formatTime = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
      gitCommitDist = shell.exec(`git commit -m "${formatTime}"`)
      eventFunc(socket, 'git commit dist', gitCommitDist)
    })
    // git push dist 
    socket.on('git push dist', data => {
      gitPushDist = shell.exec('git push origin master')
      eventFunc(socket, 'git push dist', gitPushDist)
    })
    socket.on('disconnect', reason => {
      console.log('reason', reason)
    })
  })
}

module.exports = socketProcess