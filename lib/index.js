/**
 * CI scripts for example projects
 * @module sugo-ci-example
 */

'use strict'

let d = (module) => module.default || module

module.exports = {
  get build () { return d(require('./build')) },
  get compile () { return d(require('./compile')) },
  get cover () { return d(require('./cover')) },
  get favicon () { return d(require('./favicon')) },
  get format () { return d(require('./format')) },
  get ghpages () { return d(require('./ghpages')) },
  get heroku () { return d(require('./heroku')) },
  get release () { return d(require('./release')) },
  get report () { return d(require('./report')) },
  get share () { return d(require('./share')) },
  get test () { return d(require('./test')) },
  get update () { return d(require('./update')) }
}
