/**
 * Set up heroku branch
 * @function heroku
 * @param {Object} options - Optional settings
 * @returns {Promise}
 */
'use strict'

const defaults = require('defaults')
const co = require('co')
const { runTasks } = require('ape-tasking')
const { execSync } = require('child_process')
const { hasBin } = require('sg-check')

/** @lends heroku */
function heroku (options = {}) {
  let { taskName, cwd } = defaults(options, {
    taskName: 'heroku',
    cwd: process.cwd()
  })
  let execOptions = {
    cwd,
    stdio: 'inherit'
  }
  return runTasks(taskName, [
    () => co(function * () {
      let hasMajikaHeroku = yield hasBin('majika-heroku')
      if (!hasMajikaHeroku) {
        let message = `
You need majika-heroku!
To install majika-heroku, try 'npm install majika-heroku -g'
`
        throw Error(message)
      }

      execSync('majika-heroku deploy', execOptions)
    })
  ], true)
}

module.exports = heroku
