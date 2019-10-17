const { ExpressionParser } = require('./JassExpressionParser')
const { JassLexer, tokenVocabulary } = require('./JassLexer')

class JassParser extends ExpressionParser {
  constructor (...args) {
    super(...args)
    const $ = this
    $.RULE('program', () => {
      $.OPTION1(() => {
        $.SUBRULE($.globaldefinitions)
      })
      $.OPTION2(() => {
        $.MANY(() => {
          $.SUBRULE($.funcdeclarations)
        })
      })
    })

    $.RULE('globaldefinitions', () => {
      $.CONSUME(tokenVocabulary.globals)
      $.SUBRULE($.vardeclarations)
      $.CONSUME(tokenVocabulary.endglobals)
    })

    $.RULE('vardeclarations', () => {
      $.MANY(() => $.SUBRULE($.vardeclaration))
    })

    $.RULE('vardeclaration', () => {
      $.CONSUME(tokenVocabulary.identifier)
      $.CONSUME2(tokenVocabulary.identifier)
      $.OPTION(() => {
        $.CONSUME3(tokenVocabulary.equals)
        $.SUBRULE($.expression)
      })
    })

    $.RULE('funcdeclarations', () => {
      $.CONSUME(tokenVocabulary.function)
      $.CONSUME2(tokenVocabulary.identifier)
      $.CONSUME3(tokenVocabulary.takes)
      $.SUBRULE($.funcarglist)
      $.CONSUME5(tokenVocabulary.returns)
      $.CONSUME6(tokenVocabulary.nothing)
      $.MANY1(() => $.SUBRULE($.localvardeclaration))
      $.MANY2(() => $.SUBRULE($.statement))
      $.CONSUME7(tokenVocabulary.endfunction)
    })

    $.RULE('funcarglist', () => {
      $.OR([
        { ALT: () => { $.CONSUME(tokenVocabulary.nothing) } },
        {
          ALT: () => {
            $.SUBRULE($.funcarg)
            $.MANY(() => {
              $.CONSUME(tokenVocabulary.comma)
              $.SUBRULE2($.funcarg)
            })
          }
        },
      ])
    })

    $.RULE('funcarg', () => {
      $.CONSUME(tokenVocabulary.identifier)
      $.CONSUME2(tokenVocabulary.identifier)
    })

    $.RULE('localvardeclaration', () => {
      $.CONSUME(tokenVocabulary.local)
      $.SUBRULE($.vardeclaration)
    })

    $.RULE('ifstatement', () => {
      $.CONSUME(tokenVocabulary.if)
      $.CONSUME(tokenVocabulary.lparen)
      $.SUBRULE9($.expression)
      $.CONSUME(tokenVocabulary.rparen)
      $.CONSUME(tokenVocabulary.then)
      $.MANY(() => $.SUBRULE($.statement))
      $.MANY2(() => $.SUBRULE($.optionalElseIf))
      $.OPTION(() => $.SUBRULE($.optionalElse))
      $.CONSUME(tokenVocabulary.endif)
    })

    $.RULE('optionalElse', () => {
      $.CONSUME(tokenVocabulary.else)
      $.MANY(() => $.SUBRULE($.statement))
    })

    $.RULE('optionalElseIf', () => {
      $.CONSUME(tokenVocabulary.elseif)
      $.CONSUME2(tokenVocabulary.lparen)
      $.SUBRULE3($.expression)
      $.CONSUME3(tokenVocabulary.rparen)
      $.CONSUME4(tokenVocabulary.then)
      $.MANY4(() => $.SUBRULE($.statement))
    })

    $.RULE('statement', () => {
      $.OR4([
        { ALT: () => { $.SUBRULE($.callstatement) } },
        { ALT: () => { $.SUBRULE($.setstatement) } },
        { ALT: () => { $.SUBRULE($.ifstatement) } },
        { ALT: () => { $.SUBRULE($.loopstatement) } },
        { ALT: () => { $.SUBRULE($.exitwhenstatement) } }
      ])
    })

    $.RULE('exitwhenstatement', () => {
      $.CONSUME(tokenVocabulary.exitwhen)
      $.SUBRULE($.expression)
    })

    $.RULE('callstatement', () => {
      $.CONSUME(tokenVocabulary.call)
      $.SUBRULE($.functioncall)
    })

    $.RULE('loopstatement', () => {
      $.CONSUME(tokenVocabulary.loop)
      $.MANY(() => $.SUBRULE($.statement))
      $.CONSUME(tokenVocabulary.endloop)
    })

    $.RULE('setstatement', () => {
      $.CONSUME(tokenVocabulary.set)
      $.CONSUME(tokenVocabulary.identifier)
      $.MANY(() => {
        $.CONSUME(tokenVocabulary.lsquareparen)
        $.SUBRULE2($.expression)
        $.CONSUME(tokenVocabulary.rsquareparen)
      })
      $.CONSUME(tokenVocabulary.equals)
      $.SUBRULE($.expression)
    })

    this.performSelfAnalysis()
  }
}

const parserInstance = new JassParser()
module.exports = {
  parserInstance: parserInstance,
  JassParser,
  parse: function (inputText) {
    const lexResult = JassLexer.tokenize(inputText)
    parserInstance.input = lexResult.tokens
    const output = parserInstance.program()
    if (parserInstance.errors.length > 0) {
      throw Error(
        'Sad sad panda, parsing errors detected!\n' +
                    parserInstance.errors[0].message
      )
    }
    return output
  }
}
