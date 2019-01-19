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
          Last registration: ${formatDateTime(item.lastPostponed)}
        </div>
      `
    }
  }

  return html`
    <body class="container mx-auto m-4">
      <main>
        ${state.items && state.items.map(renderItem)}
      </main>
    </body>
  `

  function handlePostpone (e) {
    e.preventDefault()
    const item = e.target
    const index = item.dataset.index
    emit('item:postpone', index)
  }
}
