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

  it('handles var declarations with initializer and without initializer', () => {
    const input = `
        function test takes nothing returns nothing
          local unit u
          local unit t = CreateUnit()
        endfunction    
    `
    expect(() => parse(input)).not.toThrow()
  })

  it('handles a func with more than one argument', () => {
    const input = `
        function test takes unit u, trigger t returns nothing
          local unit u
          local unit t = CreateUnit()
        endfunction    
    `
    expect(() => parse(input)).not.toThrow()
  })

  it('handles a func with no argument', () => {
    const input = `
        function test takes nothing returns nothing
          local unit u
          local unit t = CreateUnit()
        endfunction    
    `
    expect(() => parse(input)).not.toThrow()
  })
})
