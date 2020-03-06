const ora = require('ora')
const axios = require('axios')

const check = async (host) => {
  const spinner = ora(`Testing connection to ${host}...`).start()

  const url = `${host}/api/v1/test`
  try {
    const { data } = await axios.get(url)
    spinner.succeed(`Connected! ${data}`)
  } catch (error) {
    spinner.fail(`Failed to connect to ${url}:
${error}
    `)
    process.exit()
  } finally {
    spinner.stop()
  }
}
module.exports = check
