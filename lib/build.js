/**
 * Build the project
 * @function build
 * @param {Object} options - Optional settings
 * @returns {Promise}
 */
'use strict'

const coz = require('coz')
const co = require('co')
const filelink = require('filelink')
const defaults = require('defaults')
const abrowserify = require('abrowserify')
const ascss = require('ascss')
const aglob = require('aglob')
const { writeFileAsync, readFileAsync } = require('asfs')
const ababelReact = require('ababel-react')
const { runTasks } = require('ape-tasking')
const { extractSourcemap } = require('ape-compiling')

let isForked = !!process.send

/** @lends build */
function build (theme, options = {}) {
  let {
    taskName,
    render,
    reactJsx,
    scssSrc,
    browserifySrc,
    browserifyDest,
    externalCC,
    themeCss
  } = defaults(options, {
    taskName: 'build',
    render: [
      '.*.bud',
      'lib/.*.bud',
      'ui/**/.*.bud',
      'test/.*.bud'
    ],
    reactRender: 'ui/js/lib/.*.jsx.bud',
    reactJsx: '*.jsx',
    scssSrc: 'ui/css/*.scss',
    browserifySrc: 'ui/js/lib/entrypoint.js',
    browserifyDest: 'ui/js/index.js',
    externalCC: 'ui/js/external.cc.js',
    themeCss: 'ui/css/theme.css'
  })

  return runTasks(taskName, [
    () => coz.render(render),
    () => ababelReact(reactJsx, {
      cwd: 'ui/js/lib',
      out: 'ui/js/lib'
    }),
    () => co(function * () {
      yield abrowserify(browserifySrc, browserifyDest, {
        debug: true
      })
      let compiled = yield readFileAsync(browserifyDest)
      // This is a hack to exports `require` to the window.
      compiled = `window.require = ${String(compiled)}`
      yield writeFileAsync(browserifyDest, compiled)
      yield extractSourcemap(browserifyDest)
    }),
    () => filelink(
      require.resolve('apeman-asset-javascripts/dist/default.external.cc.js'),
      externalCC,
      { force: true }
    ),
    // Generate theme css
    () => co(function * () {
      yield writeFileAsync(themeCss, theme)
    }),
    // Compile scss
    () => co(function * () {
      let filenames = yield aglob(scssSrc)
      for (let filename of filenames) {
        yield ascss(filename, filename.replace(/\.scss$/, '.css'))
      }
    })
  ], !isForked)
}

module.exports = build

process.on('message', (message) => {
  if (message.rerun) {
    runTasks.rerun()
  }
})
