const fs = require('fs')
const path = require('path')
const { parse } = require('../lib/JassParser')

describe('JassParser', () => {
  it('parses example war3map.j successfully', () => {
    const input = fs.readFileSync(path.resolve(__dirname, './samples/war3map.j'), 'utf8')
    expect(() => parse(input)).not.toThrow()
  })
})
