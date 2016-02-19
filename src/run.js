#!/usr/bin/env node

import 'babel-register'

import path from 'path'
import {remove, mkdirs, readdir, stat, readFile, writeFile} from 'fs-promise'

import {transform} from 'babel-core'
import chalk from 'chalk'

import plugin from './babel-plugin'

const babelOption = {
  babelrc: false,
  compact: false,
  comments: false,
}

const cwd = process.cwd()

const logPath = path.join(cwd, 'log', 'integration')
const testRootPath = path.join(cwd, 'test', 'integration')

async function run () {
  await remove(logPath)
  await mkdirs(logPath)

  const listTests = await readdir(testRootPath)
  await Promise.all(listTests.map(async (testName) => {
    const casePath = path.join(testRootPath, testName)
    const fsStat = await stat(casePath)
    if (!fsStat.isDirectory()) {
      return
    }

    const inputSrc = await readFile(path.join(casePath, 'input.refjs'))
    const expectSrc = await readFile(path.join(casePath, 'expect.js'))
    let init
    try {
      init = require(path.join(casePath, 'init.js'))
    } catch (err) {
      init = {}
    }

    const input = transform(inputSrc, {
      ...babelOption,
      filename: `${testName}.refjs`,
      plugins: [plugin(init)],
    }).code

    const expect = transform(expectSrc, {
      ...babelOption,
      filename: `${testName}.js`,
    }).code

    if (input === expect) {
      console.log(`${chalk.green(testName)} - passed`)
    } else {
      console.log(`${chalk.red(testName)} - failed`)
      await writeFile(path.join(logPath, `${testName}.js`), input)
    }
  }))
}

run().then(function success () {
  console.log('RefineryJS integration done')
}, function error (err) {
  throw err
})
