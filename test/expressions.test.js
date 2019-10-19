const { parse, parserInstance } = require('../lib/JassExpressionParser')

beforeAll(() => {
  parserInstance.performSelfAnalysis()
})

describe('expressions', () => {
  it('addition', () => {
    const input = '1+2'
    expect(parse(input)).toMatchSnapshot()
  })
  it('multiplication', () => {
    const input = '1*2'
    expect(parse(input)).toMatchSnapshot()
  })
  it('division', () => {
    const input = '1/4'
    expect(parse(input)).toMatchSnapshot()
  })
  it('subtraction', () => {
    const input = '1-2'
    expect(parse(input)).toMatchSnapshot()
  })
  it('array access', () => {
    const input = 'arrayident[2]'
    expect(parse(input)).toMatchSnapshot()
  })
})
