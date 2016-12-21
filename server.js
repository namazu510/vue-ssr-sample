process.env.VUE_ENV = 'server'

const fs = require('fs')
const path = require('path')
const express = require('express')
const compression = require('compression')
const serialize = require('serialize-javascript')
const resolve = file => path.resolve(__dirname, file)

const app = express()

const indexHTML = parseIndex(fs.readFileSync(resolve('./dist/index.html'), 'utf-8'))
const renderer = createRenderer(fs.readFileSync(resolve('./dist/server-bundle.js'), 'utf-8'))



function createRenderer (bundle) {
  // https://github.com/vuejs/vue/blob/next/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  return require('vue-server-renderer').createBundleRenderer(bundle, {
    cache: require('lru-cache')({
      max: 1000,
      maxAge: 1000 * 60 * 15
    })
  })
}

function parseIndex (template) {
  const contentMarker = '<!-- APP -->'
  const i = template.indexOf(contentMarker)
  return {
    head: template.slice(0, i),
    tail: template.slice(i + contentMarker.length)
  }
}

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && 60 * 60 * 24 * 30
})

app.use(compression({ threshold: 0 }))
app.use('/dist', serve('./dist'))

app.get('*', (req, res) => {
  if (!renderer) {
    return res.end('waiting for compilation... refresh in a moment.')
  }

  res.setHeader("Content-Type", "text/html");

  const context = { url: req.url }
  const renderStream = renderer.renderToStream(context)

  renderStream.once('data', () => {
    res.write(indexHTML.head)
  })

  renderStream.on('data', chunk => {
    res.write(chunk)
  })

  renderStream.on('end', () => {
    // サーバー側のstoreをclient側に流す.
    // windowに__INITIAL_STATE__みたいなプロパティをはやしておいてそこに入れておく
    // client-entryでこのオブジェクトでstateを置き換える.
    if (context.initialState) {
      res.write(
        `<script>window.__INITIAL_STATE__=${
          serialize(context.initialState, { isJSON: true })
        }</script>`
      )
    }
    res.end(indexHTML.tail)
  })

  // error処理
  renderStream.on('error', err => {
    if (err && err.code === '404') {
      res.status(404).end('404 | Page Not Found')
      return
    }
    // Render Error Page or Redirect
    res.status(500).end('Internal Error 500')
    console.error(`error during render : ${req.url}`)
    console.error(err)
  })
})

const port = 8080
app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})
