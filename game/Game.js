const React = require('react')
const PropTypes = require('prop-types')
const { Box, Text } = require('ink')
const importJsx = require('import-jsx')

const fs = require('fs')

const FileWatcher = importJsx('./FileWatcher')
const Spinner = importJsx('./components/Spinner')

class Game extends React.Component {
  constructor () {
    super()
    this.pushUpdate = this.pushUpdate.bind(this)
    this.setupSocketListeners = this.setupSocketListeners.bind(this)
    this.state = {
      gameStarted: false
    }
  }

  componentDidMount () {
    this.setupSocketListeners()
  }

  setupSocketListeners () {
    const { socket } = this.props.connection
    socket.on('antFileUpdate', ({ result, error, liveAntFileVersion }) => {
      this.setState(s => {
        if (error) return { error }
        if (result) {
          return { updating: false, error: undefined, liveAntFileVersion }
        }
      })
    })
    socket.on('gameStart', () => {
      this.setState({ gameStarted: true })
    })
  }

  pushUpdate (antFilePath, antFileVersion) {
    this.setState({ updating: true, antFileVersion }, () => {
      const antFile = fs.readFileSync(antFilePath).toString()
      this.props.connection.socket.emit('antFileUpdate', { antFile, antFileVersion })
    })
  }

  render () {
    const { gamecode, config } = this.props
    const { updating, antFileVersion, liveAntFileVersion, error } = this.state
    const { antDirectory, antFileName } = config
    return (
      <Box flexDirection="column" height="100%">
        <Text>Ant Party: Game {gamecode}</Text>
        <Text>Socket ID: {this.props.connection.socket.id}</Text>
        <Text>Game Started: {this.state.gameStarted ? 'Yes' : 'No'}</Text>

        <Box>
          <Box padding={1}>
            <FileWatcher config={config} pushUpdate={this.pushUpdate}/>
            <Box>
              {(updating)
                ? (<Box>
                  <Spinner />
                  <Text>{` Pushing version ${antFileVersion}...`}</Text>
                </Box>)
                : <Text>{liveAntFileVersion > 0 ? `Latest version on server: ${liveAntFileVersion}` : ''}</Text>}
            </Box>
          </Box>
        </Box>

        {
          error
            ? <Text color="red">{`${error.status}: ${error.message}`}</Text>
            : undefined
        }

        <Box alignItems="flex-end">
          <Box><Text italic>{`Open ${antDirectory}/${antFileName} and save to push changes`}</Text></Box>
        </Box>
      </Box>
    )
  }
}

Game.propTypes = {
  gamecode: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  connection: PropTypes.shape({
    io: PropTypes.func.isRequired,
    socket: PropTypes.object.isRequired
  })
}

module.exports = Game
