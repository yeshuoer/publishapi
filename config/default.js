const path = require('path')

module.exports = {
  port: 5000,
  pubPath: path.resolve(__dirname, '../../build'),
  repoPath: path.resolve(__dirname, '../../test')
}