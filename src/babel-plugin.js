import path from 'path'

import refine from 'refineryjs'

const cwd = process.cwd()
const pluginPath = path.join(cwd, 'bin', 'index.js')
const initPath = path.join(cwd, 'test', 'integration', 'init.js')

const plugin = require(pluginPath).default

let initResult = {}
try {
  initResult = require(initPath)
} catch (err) {
  console.log('\nRefineryJS integration test - Missing init.js\n')
}

const {dependencies = {}, option} = initResult

export default function RefineryJS ({types: t}) {
  return {
    visitor: {
      Program (path) {
        refine(t, path, {...dependencies, thisPlugin: [plugin, option]})
      },
    },
  }
}
