#!/usr/bin/env node

import path from 'path'
import {readdirSync, readFile, writeFile} from 'fs'

import {transform} from 'babel-core'
import chalk from 'chalk'
import {sync as rimraf} from 'rimraf'
import {sync as mkdirp} from 'mkdirp'

import plugin from './babel-plugin'

const babelOption = {
  babelrc: false,
  compact: false,
  comments: false,
}

const cwd = process.cwd()

const logPath = path.join(cwd, 'log', 'integration')
const testRootPath = path.join(cwd, 'test', 'integration')
const mapTests = new Map()

rimraf(logPath)
mkdirp(logPath)

const onTestFile = (name, type) => (err, data) => {
  if (err) {
    // Safely ignore invalide file structure
    return
  }

  const pair = mapTests.get(name)
  if (!pair) {
    mapTests.set(name, {[type]: data})
    return
  }

  pair[type] = data

  const {input, expect} = pair
  if (!input || !expect) {
    // Either input or expect file data is not arrived
    return
  }

  const inputCode = transform(input, {
    ...babelOption,
    filename: `${name}.rjs`,
    plugins: [plugin],
  }).code

  const expectCode = transform(expect, {
    ...babelOption,
    filename: `${name}.js`,
  }).code

  if (inputCode === expectCode) {
    console.log(`${chalk.green(name)} - passed`)
  } else {
    console.log(`${chalk.red(name)} - failed`)
    writeFile(path.join(logPath, `${name}.js`), inputCode, err => {
      if (err) {
        throw err
      }
    })
  }
}

for (let testName of readdirSync(testRootPath)) {
  const inputPath = path.join(testRootPath, testName, 'input.rjs')
  const expectPath = path.join(testRootPath, testName, 'expect.js')

  readFile(inputPath, 'utf8', onTestFile(testName, 'input'))
  readFile(expectPath, 'utf8', onTestFile(testName, 'expect'))
}
