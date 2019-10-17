const fs = require('fs')
const path = require('path')
const { parse } = require('../lib/JassVisitor')

describe('JassVisitor', () => {
  it('outputs correct AST for addition expression', () => {
    const input = `
        function test takes nothing returns nothing
            call somefunc(5+3)
        endfunction    
    `
    expect(parse(input)).toMatchSnapshot()
  })

  it('outputs correct AST for subtraction expression', () => {
    const input = `
        function test takes nothing returns nothing
            call somefunc(5-3)
        endfunction    
    `
    expect(parse(input)).toMatchSnapshot()
  })

  it('outputs correct AST for multiplication expression', () => {
    const input = `
        function test takes nothing returns nothing
            call somefunc(5*3)
        endfunction    
    `
    expect(parse(input)).toMatchSnapshot()
  })

  it('outputs correct AST for division expression', () => {
    const input = `
        function test takes nothing returns nothing
            call somefunc(5/3)
        endfunction    
    `
    expect(parse(input)).toMatchSnapshot()
  })

  it('outputs correct AST for loop statement', () => {
    const input = `
        function test takes nothing returns nothing
        loop
          set iterations = iterations - 1
          exitwhen iterations == 0
        endloop
        endfunction    
    `
    expect(parse(input)).toMatchSnapshot()
  })

  it('handles var declarations with initializer and without initializer', () => {
    const input = `
        function test takes nothing returns nothing
          local unit u
          local unit t = CreateUnit()
        endfunction    
    `
    expect(parse(input)).toMatchSnapshot()
  })

  it('handles multiple function args', () => {
    const input = `
    function test takes unit u, trigger t returns nothing
      local unit u
      local unit t = CreateUnit()
    endfunction      
    `
    expect(parse(input)).toMatchSnapshot()
  })

  it('handles no function args', () => {
    const input = `
    function test takes nothing returns nothing
      local unit u
      local unit t = CreateUnit()
    endfunction      
    `
    expect(parse(input)).toMatchSnapshot()
  })

  it('correctly constructs AST for identifier array access', () => {
    const input = `
    function test takes nothing returns nothing
      set test = someother[CreateUnit()][5]
    endfunction      
    `
    expect(parse(input)).toMatchSnapshot()
  })

  it('correctly constructs AST for identifier array access with left hand array access', () => {
    const input = `
    function test takes nothing returns nothing
      set test[50] = someother[CreateUnit()][5]
    endfunction      
    `
    expect(parse(input)).toMatchSnapshot()
  })

  it('correctly constructs AST for complex jass input', () => {
    const input = fs.readFileSync(path.resolve(__dirname, './samples/war3map.j'), 'utf8')
    expect(parse(input)).toMatchSnapshot()
  })
})
