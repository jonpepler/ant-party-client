const ora = require('ora')
const axios = require('axios')

module.exports = (host) => {
  const spinner = ora(`Testing connection to ${host}...`).start()

  const url = `${host}/api/v1/test`
  axios.get(url)
    .then(response => {
      spinner.succeed(`Connected! ${response.data}`)
    })
    .catch(error => {
      spinner.fail(`Failed to connect to ${url}:
  ${error}
      `)
    })
    .finally(() => {
      spinner.stop()
    })
}
