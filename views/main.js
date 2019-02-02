const html = require('choo/html')
const FileSaver = require('file-saver')
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

  function renderRefreshForm () {
    return html`
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onsubmit=${handleSubmitRefresh}>
      <div>
        <label class="block text-grey-darker text-sm font-bold mb-2" for="title">
          Refresh rate
        </label>
        <input type="text" id="refreshRate" name="refreshRate" class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div>
        <button type="submit" class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Update</button>
      </div>
      </form>
    `
  }

  function renderAddButton () {
    return html`
    <button onclick=${handleShowForm} class="flex-1 bg-blue-dark hover:bg-blue text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline">Add item</button>
    `
  }

  function renderRefreshButton () {
    return html`
    <button onclick=${handleShowForm} class="flex-1 bg-blue-dark hover:bg-blue text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline">Change refresh rate</button>
    `
  }

  function renderSaveButton () {
    return html`
    <button onclick=${handleSave} class="flex-1 bg-blue-dark hover:bg-blue text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline">Save data</button>
    `
  }

  function renderLoadButton () {
    return html`
    <input type='file' accept='.json' onchange=${handleLoad} class="hidden" />
    <button onclick=${triggerUpload} class="flex-1 bg-blue-dark hover:bg-blue text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline">Load data</button>
    `
  }

  return html`
    <body class="container mx-auto m-4">
      <main>
        ${state.items && state.items.map(renderItem)}
        ${state.showForm === true ? renderForm() : ''}
        ${state.showForm === true ? renderRefreshForm() : ''}
        <div class="flex">
          ${state.showForm === false ? renderAddButton() : ''}
          ${state.showForm === false ? renderSaveButton() : ''}
          ${state.showForm === false ? renderLoadButton() : ''}
          ${state.showForm === false ? renderRefreshButton() : ''}
        </div>
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

  function handleSave (e) {
    e.preventDefault()
    const data = {
      refreshRate: state.refreshRate,
      items: state.items
    }
    const file = new window.File([JSON.stringify(data, null, 2)], 'frestun.json', { type: 'text/json;charset=utf-8' })
    FileSaver.saveAs(file)
  }

  function triggerUpload (e) {
    e.preventDefault()
    const fileField = e.target.previousSibling
    fileField.click()
  }

  function handleLoad (e) {
    e.preventDefault()
    const reader = new window.FileReader()
    const files = e.target.files
    reader.onload = () => {
      const text = reader.result
      const data = JSON.parse(text)
      emit('data:load', data)
    }
    if (files.length === 1) {
      reader.readAsText(files[0])
    }
  }

  function handleSubmitItem (e) {
    e.preventDefault()
    var form = e.currentTarget
    var data = new window.FormData(form)
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

  function handleSubmitRefresh (e) {
    e.preventDefault()
    var form = e.currentTarget
    var data = new window.FormData(form)
    var body = {}
    for (var pair of data.entries()) {
      body[pair[0]] = pair[1]
    }
    emit('timer:update', body.refreshRate)
  }
}
