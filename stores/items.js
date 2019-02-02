module.exports = store

function store (state, emitter) {
  const checkRefresh = () => {
    const now = new Date().getTime()
    if (now - state.lastUpdated > state.refreshRate && !state.showForm) {
      state.lastUpdated = now
      emitter.emit('update:all')
    }
  }
  state.lastUpdated = new Date().getTime()
  state.showForm = false

  emitter.on('DOMContentLoaded', function () {
    emitter.on('item:postpone', function (index) {
      const item = state.items[index]
      item.lastPostponed = new Date().getTime()
      emitter.emit('update:all')
    })
    emitter.on('update:all', function (index) {
      emitter.emit(state.events.RENDER)
    })
    emitter.on('form:show', function () {
      state.showForm = true
      emitter.emit('update:all')
    })
    emitter.on('form:hide', function () {
      state.showForm = false
      emitter.emit('update:all')
    })
    emitter.on('data:load', function (data) {
      if (data && data.refreshRate) {
        state.refreshRate = data.refreshRate
      }
      if (data && data.items) {
        state.items = state.items.concat(data.items)
      }
      emitter.emit('update:all')
    })
    emitter.on('items:add', function (item) {
      state.items.push(item)
      state.showForm = false
      emitter.emit('update:all')
    })
    emitter.on('app:init', function () {
      if (!state.items) {
        state.items = []
        state.refreshRate = 10000
        emitter.emit('update:all')
      }
      state.timer = setInterval(checkRefresh, state.refreshRate)
    })
    emitter.emit('app:init')
  })
}
