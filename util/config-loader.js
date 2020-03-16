const defaults = require('../defaults')
const args = require('./arg-processor')

module.exports = { ...defaults, ...args }
