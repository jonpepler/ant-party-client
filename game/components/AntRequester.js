const React = require('react')
const PropTypes = require('prop-types')
const { Box, Text, useInput } = require('ink')

const AntRequester = ({ request, canRequest }) => {
  useInput(input => {
    if (input === 'a' && canRequest) request()
  })

  return <Box><Text>[a] Spawn New Ant</Text></Box>
}

AntRequester.propTypes = {
  canRequest: PropTypes.bool,
  request: PropTypes.func
}

module.exports = AntRequester
