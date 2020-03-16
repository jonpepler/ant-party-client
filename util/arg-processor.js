const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')

const options = [
  {
    name: 'help',
    type: Boolean,
    description: 'Print this usage guide.'
  },
  {
    name: 'server',
    alias: 's',
    type: String,
    description: 'The Ant Party server to connect to. This defaults to the official ant-party.herokuapp.com, but you might like to host your own.'
  }
]

const args = commandLineArgs(options)

const sections = [
  {
    header: 'Ant Party',
    content: 'Connects to Ant Party servers to play games.'
  },
  {
    header: 'Options',
    optionList: options
  }
]

if (args.help) {
  console.log(commandLineUsage(sections))
  process.exit()
}

// Override defaults with any user specified args
module.exports = args
