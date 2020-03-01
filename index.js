#! /usr/bin/env node

const args = require('./util/arg-processor')
const connectionCheck = require('./util/connection-checker')

connectionCheck(args.server)
