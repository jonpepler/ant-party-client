const ora = require('ora')
const axios = require('axios')
const readline = require('readline-sync')

const processErrorMessage = errorResponse => {
  if (errorResponse.response && errorResponse.response.data) {
    return errorResponse.response.data.error
  }
}

module.exports = (host) => {
  const gamecode = readline.question('  Gamecode: ')
  const spinner = ora(`Connecting to game ${gamecode}`).start()
  const url = `${host}/api/v1/game/join/${gamecode}`
  axios.post(url)
    .then(response => {
      spinner.succeed(`Joined game ${gamecode}`)
    })
    .catch(error => {
      // console.log(error)
      spinner.fail(`Game join failed:
      ${error}
      ${processErrorMessage(error)}
      `)
    })
    .finally(() => {
      spinner.stop()
    })
}
