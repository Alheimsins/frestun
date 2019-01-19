const css = require('sheetify')
const choo = require('choo')
const persist = require('choo-persist')

css('tailwindcss')

const app = choo()

if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
} else {
  app.use(require('choo-service-worker')())
  app.use(persist())
}

app.use(require('./stores/items'))

app.route('/', require('./views/main'))
app.route('/*', require('./views/404'))

module.exports = app.mount('body')
