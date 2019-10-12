const fs = require('fs')
const path = require('path')
const { parse } = require('../lib/JassParser')

describe('JassParser', () => {
  it('parses example war3map.j successfully', () => {
    const input = fs.readFileSync(path.resolve(__dirname, './samples/war3map.j'), 'utf8')
    expect(() => parse(input)).not.toThrow()
  })

  it('parses a loop statement', () => {
    const input = `
    function test takes nothing returns nothing
      local integer iterations = 10
      loop
            set iterations = iterations - 1
            exitwhen iterations == 0
      endloop
     endfunction
    `
    expect(() => parse(input)).not.toThrow()
  })
})
