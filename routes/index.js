const express = require('express')
const shell = require('shelljs')

const router = express.Router()

router.get('/', (req, res) => {
  shell.exec('git checkout hehe', (code, stdout, stderr) => {
    res.send({
      code,
      stdout,
      stderr
    })
  })
})

module.exports = router