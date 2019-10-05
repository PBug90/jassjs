const { CstParser } = require('chevrotain')
const { JassLexer, tokenVocabulary: jassTokenVocabulary } = require('./JassLexer')

class ExpressionParser extends CstParser {
  constructor () {
    super(jassTokenVocabulary)
    const $ = this

    $.RULE('comparator', () => {
      $.OR([
        {
          ALT: () => {
            $.SUBRULE($.addition)
            $.MANY(() => {
              $.OR2([
                {
                  ALT: () => {
                    $.CONSUME2(jassTokenVocabulary.equalsequals)
                  }
                },
                {
                  ALT: () => {
                    $.CONSUME2(jassTokenVocabulary.and)
                  }
                },
                {
                  ALT: () => {
                    $.CONSUME2(jassTokenVocabulary.or)
                  }
                },
                {
                  ALT: () => {
                    $.CONSUME3(jassTokenVocabulary.notequals)
                  }
                },
              ])
              $.SUBRULE2($.addition)
            })
          }
        },
      ])
    })

    $.RULE('addition', () => {
      $.OR([
        {
          ALT: () => {
            $.SUBRULE($.multiplication)
            $.MANY(() => {
              $.OR2([
                {
                  ALT: () => {
                    $.CONSUME2(jassTokenVocabulary.add)
                  }
                },
                {
                  ALT: () => {
                    $.CONSUME3(jassTokenVocabulary.sub)
                  }
                },
              ])
              $.SUBRULE2($.multiplication)
            })
          }
        },
      ])
    })

    $.RULE('multiplication', () => {
      $.OR([
        {
          ALT: () => {
            $.SUBRULE($.primary)
            $.MANY(() => {
              $.OR2([
                {
                  ALT: () => {
                    $.CONSUME2(jassTokenVocabulary.mult)
                  }
                },
                {
                  ALT: () => {
                    $.CONSUME3(jassTokenVocabulary.div)
                  }
                },
              ])
              $.SUBRULE2($.primary)
            })
          }
        },
      ])
    })

    $.RULE('primary', () => {
      $.OR([
        {
          ALT: () => {
            $.OPTION(() => $.CONSUME(jassTokenVocabulary.sub))
            $.CONSUME(jassTokenVocabulary.integer)
          }
        },
        {
          ALT: () => {
            $.CONSUME(jassTokenVocabulary.not)
            $.SUBRULE($.primary)
          }
        },
        {
          ALT: () => {
            $.SUBRULE($.functioncall)
          }
        },
        {
          ALT: () => {
            $.CONSUME(jassTokenVocabulary.lparen)
            $.SUBRULE2($.expression)
            $.CONSUME(jassTokenVocabulary.rparen)
          }
        },
        {
          ALT: () => {
            $.CONSUME3(jassTokenVocabulary.identifier)
          }
        },
        {
          ALT: () => {
            $.CONSUME(jassTokenVocabulary.function)
            $.CONSUME4(jassTokenVocabulary.identifier)
          }
        },
        {
          ALT: () => {
            $.OPTION2(() => $.CONSUME2(jassTokenVocabulary.sub))
            $.CONSUME3(jassTokenVocabulary.real)
          }
        },
        {
          ALT: () => {
            $.CONSUME3(jassTokenVocabulary.idliteral)
          }
        },
        {
          ALT: () => {
            $.CONSUME3(jassTokenVocabulary.stringliteral)
          }
        }
      ])
    })

    $.RULE('functioncall', () => {
      $.CONSUME(jassTokenVocabulary.identifier)
      $.CONSUME2(jassTokenVocabulary.lparen)
      $.OPTION(() => {
        $.SUBRULE4($.expression)
        $.MANY(() => {
          $.CONSUME(jassTokenVocabulary.comma)
          $.SUBRULE($.expression)
        })
      })
      $.CONSUME3(jassTokenVocabulary.rparen)
    })

    $.RULE('expression', () => {
      $.OR([
        {
          ALT: () => {
            $.SUBRULE($.comparator)
          }
        },
      ])
    })
  }
}

const parserInstance = new ExpressionParser()

module.exports = {
  parserInstance: parserInstance,
  ExpressionParser,
  parse: function (inputText) {
    const lexResult = JassLexer.tokenize(inputText)
    parserInstance.input = lexResult.tokens
    const output = parserInstance.expression()
    if (parserInstance.errors.length > 0) {
      throw Error(
        parserInstance.errors[0].message
      )
    }
    return output
  }
}
