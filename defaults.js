const homedir = require('os').homedir()

module.exports = {
  server: 'https://ant-party.herokuapp.com',
  antDirectory: `${homedir}/.ant-party`,
  antFileName: 'ant.js'
}
