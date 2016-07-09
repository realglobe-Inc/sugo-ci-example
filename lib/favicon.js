/**
 * Generate favicon for an example project
 * @function exampleFavicon
 * @param {Object} options - Optional settings.
 * @param {string} name - Name of project.
 * @param {string} color - Theme color of project.
 * @param {Object} [options] - Optional settings.
 * @returns {Promise}
 */
'use strict'

const defaults = require('defaults')
const filelink = require('filelink')

const { runTasks } = require('ape-tasking')
const sugosAssets = require('sugos-assets')

/** @lends exampleFavicon */
function exampleFavicon (name, color, options = {}) {
  let { taskName, faviconFile, faviconLink } = defaults(options, {
    taskName: 'favicon',
    faviconFile: 'doc/images/favicon.png',
    faviconLink: 'ui/favicon.png'
  })
  return runTasks(taskName, [
    () => sugosAssets.favicon('example', faviconFile, {
      name, color
    }).catch((err) => {
      // Ignore error
      console.log('Failed to generate favicon:', err)
    }),
    () => filelink(faviconFile, faviconLink, {
      force: true
    })
  ], true)
}

module.exports = exampleFavicon
