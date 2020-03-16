/*
  Slight variation of https://github.com/vadimdemedes/ink-spinner that compiles
  for us properly
*/

const React = require('react')
const PropTypes = require('prop-types')
const { Box } = require('ink')
const spinners = require('cli-spinners')

class Spinner extends React.Component {
  constructor () {
    super()
    this.switchFrame = this.switchFrame.bind(this)
    this.state = {
      frame: 0
    }
  }

  componentDidMount () {
    const spinner = this.getSpinner()
    this.timer = setInterval(this.switchFrame, spinner.interval)
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  getSpinner () {
    return spinners[this.props.type] || spinners.dots
  }

  switchFrame () {
    const { frame } = this.state
    const spinner = this.getSpinner()
    const isLastFrame = frame === spinner.frames.length - 1
    const nextFrame = isLastFrame ? 0 : frame + 1

    this.setState({
      frame: nextFrame
    })
  }

  render () {
    const spinner = this.getSpinner()
    return (
      <Box>
        {spinner.frames[this.state.frame]}
      </Box>
    )
  }
}

Spinner.propTypes = {
  type: PropTypes.string
}

Spinner.defaultProps = {
  type: 'dots'
}

module.exports = Spinner
