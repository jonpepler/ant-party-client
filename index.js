#! /usr/bin/env node

const args = require('./util/arg-processor')
const connectionCheck = require('./util/connection-checker')
const roomJoiner = require('./util/join-room')

async function setup () {
  await connectionCheck(args.server)
  roomJoiner(args.server)
}

setup()
