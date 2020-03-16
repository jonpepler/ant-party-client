#! /usr/bin/env node
const config = require('./util/config-loader')
const connectionCheck = require('./util/connection-checker')
const roomJoiner = require('./util/join-room')

const io = require('socket.io-client')
const socket = io(config.server)

const { render } = require('ink')
const React = require('react')
const importJsx = require('import-jsx')
const del = require('del')
const clear = require('clear')

socket.on('gameStart', () => {
  console.log('  Game started!')
})

function startGame (gamecode) {
  clear()
  const Game = importJsx('./game/Game')
  render(React.createElement(Game, {
    config,
    gamecode,
    connection: { io, socket }
  }))
}

async function setup () {
  await connectionCheck(config.server)
  roomJoiner(socket, startGame)
}

const nodeCleanup = require('node-cleanup')
nodeCleanup(() => {
  del.sync([config.antDirectory], { force: true })
})

setup()
