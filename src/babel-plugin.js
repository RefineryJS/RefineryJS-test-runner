import path from 'path'

import refine from 'refineryjs'

const cwd = process.cwd()
const pluginPath = path.join(cwd, 'src', 'index.js')
const initPath = path.join(cwd, 'test', 'integration', 'init.js')

const plugin = require(pluginPath).default

if (typeof plugin !== 'function') {
  throw new Error('RefineryJS integration test - "export default" of index.js must be a function')
}

let initResult
try {
  initResult = require(initPath)
} catch (err) {
  initResult = {}
}

const {
  dependencies: sharedDependencies = [],
  option: sharedOption,
} = initResult

export default ({dependencies = [], option}) => ({types}) => ({
  visitor: {
    Program (path) {
      refine(types, path, [
        ...sharedDependencies,
        ...dependencies,
        [
          'this-plugin',
          plugin,
          {...sharedOption, ...option},
        ],
      ])
    },
  },
})
