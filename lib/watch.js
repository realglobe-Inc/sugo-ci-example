/**
 * Watch to run tasks
 * @function watch
 * @param {Object} options - Optional settings
 * @returns {Promise}
 */

'use strict'

const awatch = require('awatch')
const { fork } = require('child_process')
const defaults = require('defaults')
const { runTasks } = require('ape-tasking')

/** @lends watch */
function watch (script, options = {}) {
  let forked = fork(script)
  let {
    taskName,
    pattern
  } = defaults(options, {
    pattern: 'ui/**/*.*'
  })

  let _timer
  return runTasks(taskName, [
    () => new Promise((resolve, reject) => {
      awatch([
        pattern
      ], (ev, filename) => {
        clearTimeout(_timer)
        _timer = setTimeout(() =>
          forked.send({ rerun: { ev, filename } }), 100
        )
      })
    })
  ], false)
}

module.exports = watch
