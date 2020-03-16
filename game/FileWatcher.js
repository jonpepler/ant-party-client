const React = require('react')
const PropTypes = require('prop-types')
const { Box, Text, Color } = require('ink')
const fs = require('fs')
const watch = require('node-watch')
const jsdiff = require('diff')
require('colors')

class FileWatcher extends React.Component {
  constructor (props) {
    super(props)

    this.setupWatcher = this.setupWatcher.bind(this)
    this.getBackupFilePath = this.getBackupFilePath.bind(this)
    this.handleFileChange = this.handleFileChange.bind(this)

    const { config } = props
    const fileName = config.antFileName
    this.state = {
      fileName,
      filePath: `${config.antDirectory}/${fileName}`,
      versionDir: `${config.antDirectory}/.version`,
      antFileVersion: 0,
      diff: []
    }
  }

  componentDidMount () {
    this.setupWatcher()
  }

  setupWatcher () {
    const { config } = this.props
    const { fileName, filePath, versionDir } = this.state
    const baseFilePath = `./${fileName}`
    const antFileVersion = 0

    if (!fs.existsSync(config.antDirectory)) {
      fs.mkdirSync(config.antDirectory, { recursive: true })
    }

    fs.copyFileSync(baseFilePath, filePath)

    if (!fs.existsSync(versionDir)) {
      fs.mkdirSync(versionDir, { recursive: true }, err => {
        if (err) throw err
      })
    }
    fs.copyFileSync(baseFilePath, this.getBackupFilePath(antFileVersion))

    // Watch files in .ant-party that are not the .version directory
    watch(config.antDirectory, { recursive: true, filter: p => !/\.version/.test(p) }, this.handleFileChange)
  }

  getBackupFilePath (version) {
    return `${this.state.versionDir}/${version}`
  }

  handleFileChange (evt, name) {
    const { filePath, antFileVersion } = this.state

    const file = fs.readFileSync(filePath).toString()
    const previousFile = fs.readFileSync(this.getBackupFilePath(antFileVersion)).toString()
    this.setState(s => {
      const antFileVersion = s.antFileVersion + 1
      const backupPath = this.getBackupFilePath(antFileVersion)
      fs.copyFileSync(filePath, backupPath)
      this.props.pushUpdate(backupPath, antFileVersion)
      return { antFileVersion }
    })

    const diff = jsdiff.diffLines(previousFile, file)

    this.setState({ diff })
  }

  render () {
    const { diff, antFileVersion } = this.state
    const additions = diff.filter(part => part.added).length
    const removals = diff.filter(part => part.removed).length
    const marginLeft = 5 - additions.toString().length + 1
    return (
      <Box width={20} justifyContent="space-between" flexDirection="column">
        <Text>Ant Version: {antFileVersion}</Text>
        <Box>
          <Box><Color green>+{additions}</Color></Box>
          <Box marginLeft={marginLeft}><Color red>-{removals}</Color></Box>
        </Box>
      </Box>
    )
  }
}

module.exports = FileWatcher

FileWatcher.propTypes = {
  config: PropTypes.object,
  pushUpdate: PropTypes.func
}
