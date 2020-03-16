const ora = require('ora')
const readline = require('readline-sync')

module.exports = (socket, startGame) => {
  const gamecode = readline.question('  Gamecode: ')
  const playerName = readline.question('  Name: ')
  const spinner = ora(`Connecting to game ${gamecode}`).start()

  socket.on('joinGame', response => {
    const { result, error } = response
    if (result) {
      spinner.succeed(`Joined game ${gamecode}`)
    } else {
      spinner.fail(`Game join failed:
      ${error.status}: ${error.message}`)
    }
    clearTimeout(this.timer)
    spinner.stop()
    if (result) startGame(gamecode)
    if (error) process.exit()
  })

  const timedOut = () => {
    spinner.fail(`Timed out connecting to ${gamecode}`)
    process.exit()
  }

  this.timer = setTimeout(timedOut, 60000)
  socket.emit('joinGame', { gamecode, playerName })
}
