/**
 * todo:
 * change the cmd of 'npm run build'
 * change the variavle of buildPath
 */
const shell = require('shelljs')
const router = require('express').Router()
const path = require('path')
const utils = require('../utils')

router.post('/', (req, res) => {
  let repo = req.body.repo
  const io = req.io
  io.of('/pub')
    .on('connection', async socket => {
      res.send('start')
      console.log('starting....................................')
      let handleShell = utils.handleShell(shell, socket)
      let repoPath = path.join(__dirname, '..', '..', repo)
      let buildPath = path.join(__dirname, '..', '..', 'build')

      // come into repo, change to the branch of dev and pull code from the remote
      shell.cd(repoPath)
      await handleShell('git checkout dev')
      await handleShell('git pull origin dev')

      // the opration in branch of master
      await handleShell('git checkout master')
      await handleShell('git merge dev')
      await handleShell('git push origin master')
      await handleShell('npm run build')

      // the opration in build directory
      shell.cd(buildPath)
      shell.ls()
      await handleShell('git pull origin master')
      shell.cp('-R', './build', buildPath)
      await handleShell('git add .')
      await handleShell(`git commit -m "release ${new Date().toLocaleString()}"`)
      await handleShell('git push origin master')
      socket.disconnect(true)
  })
})

module.exports = router