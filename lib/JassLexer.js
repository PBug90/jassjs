const { createToken, Lexer } = require('chevrotain')

const tokens = [
  createToken({
    name: 'comment',
    pattern: /\/\/.*/,
    group: Lexer.SKIPPED
  }),
  createToken({
    name: 'whitespace',
    pattern: /\s+/,
    group: Lexer.SKIPPED
  }),
  createToken({ name: 'comma', pattern: /,/ }),
  createToken({ name: 'if', pattern: /if/ }),
  createToken({ name: 'then', pattern: /then/ }),
  createToken({ name: 'elseif', pattern: /elseif/ }),
  createToken({ name: 'else', pattern: /else/ }),
  createToken({ name: 'endif', pattern: /endif/ }),
  createToken({ name: 'globals', pattern: /globals/ }),
  createToken({ name: 'endglobals', pattern: /endglobals/ }),
  createToken({ name: 'function', pattern: /function/ }),
  createToken({ name: 'takes', pattern: /takes/ }),
  createToken({ name: 'returns', pattern: /returns/ }),
  createToken({ name: 'endfunction', pattern: /endfunction/ }),
  createToken({ name: 'and', pattern: /and/ }),
  createToken({ name: 'or', pattern: /or/ }),
  createToken({ name: 'local', pattern: /local/ }),
  createToken({ name: 'set', pattern: /set/ }),
  createToken({ name: 'loop', pattern: /loop/ }),
  createToken({ name: 'exitwhen', pattern: /exitwhen/ }),
  createToken({ name: 'endloop', pattern: /endloop/ }),
  createToken({ name: 'nothing', pattern: /nothing/ }),
  createToken({ name: 'not', pattern: /not/ }),
  createToken({ name: 'call', pattern: /call/ }),
  createToken({ name: 'mult', pattern: /\*/ }),
  createToken({ name: 'div', pattern: /\// }),
  createToken({ name: 'add', pattern: /\+/ }),
  createToken({ name: 'sub', pattern: /-/ }),
  createToken({ name: 'identifier', pattern: /[a-zA-Z]\w*/ }),
  createToken({ name: 'lparen', pattern: /\(/ }),
  createToken({ name: 'rparen', pattern: /\)/ }),
  createToken({ name: 'notequals', pattern: /!=/ }),
  createToken({ name: 'equalsequals', pattern: /==/ }),
  createToken({ name: 'equals', pattern: /=/ }),
  createToken({ name: 'idliteral', pattern: /'.*'/ }),
  createToken({ name: 'stringliteral', pattern: /".*"/ }),
  createToken({ name: 'real', pattern: /[0-9]+\.[0-9]+/ }),
  createToken({ name: 'integer', pattern: /[0-9]+/ }),
]

const tokenVocabulary = {}

tokens.forEach(tokenType => {
  tokenVocabulary[tokenType.name] = tokenType
})

const JassLexer = new Lexer(tokens)

module.exports = {
  JassLexer,
  tokenVocabulary
}
