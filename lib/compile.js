/**
 * Compile an example project
 * @function exampleCompile
 * @param {string} color - Theme color string
 * @param {Object} options - Optional settings
 * @returns {Promise}
 */
'use strict'

const co = require('co')
const coz = require('coz')
const defaults = require('defaults')
const { readFileAsync, writeFileAsync } = require('asfs')
const { runTasks } = require('ape-tasking')
const filelink = require('filelink')
const expandglob = require('expandglob')
const apeCompiling = require('ape-compiling')

/** @lends exampleCompile */
function exampleCompile (theme, options = {}) {
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
    taskName: 'compile',
    render: 'ui/js/lib/.*.jsx.bud',
    reactJsx: '*.jsx',
    scssSrc: 'ui/css/*.scss',
    browserifySrc: 'ui/js/lib/entrypoint.js',
    browserifyDest: 'ui/js/index.js',
    externalCC: 'ui/js/external.cc.js',
    themeCss: 'ui/css/theme.css'
  })

  return runTasks(taskName, [
    // Generate markdowns, snippets...
    () => coz.render(render),
    // JSX -> JS
    () => apeCompiling.compileReactJsx(reactJsx, {
      cwd: 'ui/js/lib',
      out: 'ui/js/lib'
    }),
    // Browserify
    () => co(function * () {
      yield apeCompiling.browserifyJs(browserifySrc, browserifyDest, {
        debug: true,
        external: require('apeman-asset-javascripts/src/default.external.json')
      })
      let compiled = yield readFileAsync(browserifyDest)
      // This is a hack to exports `require` to the window.
      compiled = `window.require = ${String(compiled)}`
      yield writeFileAsync(browserifyDest, compiled)
      yield apeCompiling.extractSourcemap(browserifyDest)
    }),
    // Copy external
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
      let filenames = yield expandglob(scssSrc)
      for (let filename of filenames) {
        yield apeCompiling.compileScss(filename, filename.replace(/\.scss$/, '.css'))
      }
    })
  ], true)
}

module.exports = exampleCompile
