const html = require('choo/html')
const calculateColor = require('../lib/calculate-color')
const TITLE = 'Frestun'

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  function renderItem (item, index) {
    if (!item) {
      return false
    } else {
      return html`
        <div data-index="${index}" class="bg-${calculateColor(item)} shadow-md rounded px-8 pt-6 pb-8 mb-2" onclick=${handlePostpone}>
          <h1>${item.title}</h1>
          Last registration: ${item.lastPostponed || 'Unknown'}
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
    console.log(index)
    emit('item:postpone', index)
  }
}
