const html = require('choo/html')
const calculateColor = require('../lib/calculate-color')
const calculateText = require('../lib/calculate-text')
const formatDateTime = require('../lib/format-date-time')
const TITLE = 'Frestun'

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  function renderItem (item, index) {
    if (!item) {
      return false
    } else {
      const bgColor = calculateColor(item)
      const txtColor = calculateText(bgColor)
      return html`
        <div data-index="${index}" class="bg-${bgColor} text-${txtColor} shadow-md rounded px-8 pt-6 pb-8 mb-2 cursor-pointer" onclick=${handlePostpone}>
          <h1>${item.title}</h1>
          Last updated: ${formatDateTime(item.lastPostponed)}
        </div>
      `
    }
  }

  function renderForm () {
    return html`
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onsubmit=${handleSubmitItem}>
      <div>
        <label class="block text-grey-darker text-sm font-bold mb-2" for="title">
          Title
        </label>
        <input type="text" id="title" name="title" class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div>
        <label class="block text-grey-darker text-sm font-bold mb-2" for="red">
          Limit red
        </label>
        <input type="text" id="red" name="red" class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div>
        <label class="block text-grey-darker text-sm font-bold mb-2" for="orange">
          Limit orange
        </label>
        <input type="text" id="orange" name="orange" class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div>
        <label class="block text-grey-darker text-sm font-bold mb-2" for="yellow">
          Limit yellow
        </label>
        <input type="text" id="yellow" name="yellow" class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div>
        <button type="submit" class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add</button>
      </div>
      </form>
    `
  }

  return html`
    <body class="container mx-auto m-4">
      <main>
        ${state.items && state.items.map(renderItem)}
        ${state.showForm === true ? renderForm() : ''}
        <button onclick=${handleShowForm} class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add item</button>
      </main>
    </body>
  `

  function handlePostpone (e) {
    e.preventDefault()
    const item = e.target
    const index = item.dataset.index ? item.dataset.index : item.parentNode.dataset.index
    emit('item:postpone', index)
  }

  function handleShowForm (e) {
    e.preventDefault()
    emit('form:show')
  }

  function handleSubmitItem (e) {
    e.preventDefault()
    var form = e.currentTarget
    var data = new window.FormData(form)
    console.log(data.entries)
    var body = {}
    for (var pair of data.entries()) {
      body[pair[0]] = pair[1]
    }
    const item = {
      title: body.title,
      limits: {
        red: body.red,
        orange: body.orange,
        yellow: body.yellow
      }
    }
    emit('items:add', item)
  }
}
