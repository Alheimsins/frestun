const items = require('../data.json')

module.exports = store

function store (state, emitter) {
  state.lastUpdated = new Date().getTime()

  emitter.on('DOMContentLoaded', function () {
    emitter.on('item:postpone', function (index) {
      const item = state.items[index]
      item.lastPostponed = new Date().getTime()
      emitter.emit(state.events.RENDER)
    })
    emitter.on('update:all', function (index) {
      emitter.emit(state.events.RENDER)
    })
    emitter.on('app:init', function () {
      if (!state.items) {
        state.items = items
        emitter.emit('update:all')
      }
    })
    emitter.emit('app:init')
    setInterval(function () {
      const now = new Date().getTime()
      if (now - state.lastUpdated > 10000) {
        state.lastUpdated = now
        emitter.emit('update:all')
      }
    }, 10000)
  })
}
