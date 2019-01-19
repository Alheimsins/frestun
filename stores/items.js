module.exports = store

function store (state, emitter) {
  state.items = []

  emitter.on('DOMContentLoaded', function () {
    emitter.on('store:init', function () {
      if (state.items.length === 0) {
        emitter.emit('data:load')
      }
    })
    emitter.on('data:load', function () {
      const data = require('../data.json')
      state.items = data
      emitter.emit(state.events.RENDER)
    })
    emitter.on('item:postpone', function (index) {
      const item = state.items[index]
      item.lastPostponed = new Date().getTime()
      emitter.emit(state.events.RENDER)
    })
    emitter.emit('store:init')
  })
}
