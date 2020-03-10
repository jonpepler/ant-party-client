#! /usr/bin/env node

const args = require('./util/arg-processor')
const connectionCheck = require('./util/connection-checker')
const roomJoiner = require('./util/join-room')

const io = require('socket.io-client')
const socket = io(args.server)

async function setup () {
  await connectionCheck(args.server)
  roomJoiner(socket)
}

socket.on('gameStart', () => {
  console.log('  Game started!')
})

setup()
