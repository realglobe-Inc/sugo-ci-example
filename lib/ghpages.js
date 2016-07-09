/**
 * Deploy GitHub Pages for an example project
 * @function ghpages
 * @param {Object} options - Optional settings
 * @returns {Promise}
 */
'use strict'

const { runTasks } = require('ape-tasking')
const apeDeploying = require('ape-deploying')
const defaults = require('defaults')

/** @lends ghpages */
function ghpages (options = {}) {
  let { taskName, dirname } = defaults(options, {
    taskName: 'ghpages',
    dirname: 'doc'
  })
  return runTasks(taskName, [
    () => apeDeploying.deployGhPages(dirname)
  ], true)
}

module.exports = ghpages
