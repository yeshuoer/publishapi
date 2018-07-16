/**
 * todo:
 * change the cmd of 'npm run build'
 * change the variavle of buildPath
 */
const shell = require('shelljs')
const router = require('express').Router()
const path = require('path')
const utils = require('../utils')

router.get('/', (req, res) => {
  const io = req.io
  io.of('/pub')
    .on('connection', socket => {
      socket.on('repo', repo => {
        socket.emit('status', 'will disconnect?')
        console.log('starting....................................')
        let handleShell = utils.handleShell(shell, socket)
        let repoPath = path.join(__dirname, '..', '..', repo)
        let buildPath = path.join(__dirname, '..', '..', 'build')

        // come into repo, change to the branch of dev and pull code from the remote
        shell.cd(repoPath)
        handleShell('git checkout dev')
        handleShell('git pull origin dev')

        // the opration in branch of master
        handleShell('git checkout master')
        handleShell('git merge dev')
        handleShell('git push origin master')
        handleShell('npm run build')

        // // the opration in build directory
        // shell.cd(buildPath)
        // shell.ls()
        // handleShell('git pull origin master')
        // shell.cp('-R', './build', buildPath)
        // handleShell('git add .')
        // handleShell(`git commit -m "release ${new Date().toLocaleString()}"`)
        // handleShell('git push origin master')
        socket.disconnect(true)
      })
  })
})

module.exports = router