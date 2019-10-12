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

  it('correctly constructs AST for complex jass input', () => {
    const input = fs.readFileSync(path.resolve(__dirname, './samples/war3map.j'), 'utf8')
    expect(parse(input)).toMatchSnapshot()
  })
})
