const { parse, parserInstance } = require('./JassParser')
const BasicJassVisitor = parserInstance.getBaseCstVisitorConstructorWithDefaults()

class JassVisitor extends BasicJassVisitor {
  constructor () {
    super()
    this.validateVisitor()
  }

  program (ctx) {
    return {
      functions: ctx.funcdeclarations.map(fd => this.visit(fd))
    }
  }

  statement (ctx) {
    if (ctx.callstatement) {
      return this.visit(ctx.callstatement)
    }

    if (ctx.setstatement) {
      return this.visit(ctx.setstatement)
    }

    if (ctx.ifstatement) {
      return this.visit(ctx.ifstatement)
    }

    if (ctx.loopstatement) {
      return this.visit(ctx.loopstatement)
    }

    if (ctx.exitwhenstatement) {
      return this.visit(ctx.exitwhenstatement)
    }
  }

  callstatement (ctx) {
    return {
      ...this.visit(ctx.functioncall),
      type: 'callstatement',
    }
  }

  functioncall (ctx) {
    return {
      type: 'functioncall',
      calledFunc: ctx.identifier[0].image,
      args: ctx.expression ? ctx.expression.map(expr => this.visit(expr)) : []
    }
  }

  setstatement (ctx) {
    return {
      type: 'setstm',
      variable: ctx.identifier[0].image,
      value: this.visit(ctx.expression)
    }
  }

  ifstatement (ctx) {
    return {
      type: 'ifstatement',
      condition: this.visit(ctx.expression[0]),
      block: ctx.statement ? ctx.statement.map(stm => this.visit(stm)) : [],
      elseifs: ctx.optionalElseIf ? ctx.optionalElseIf.map(stm => this.visit(stm)) : [],
      else: ctx.optionalElse && ctx.statement ? ctx.statement.map(stm => this.visit(stm)) : []
    }
  }

  optionalElseIf (ctx) {
    return {
      condition: this.visit(ctx.expression[0]),
      block: ctx.statement ? ctx.statement.map(stm => this.visit(stm)) : [],
    }
  }

  optionalElse (ctx) {
    return {
      block: ctx.statement ? ctx.statement.map(stm => this.visit(stm)) : [],
    }
  }

  expression (ctx) {
    return this.visit(ctx.comparator)
  }

  comparator (ctx) {
    if (ctx.equalsequals) {
      return {
        type: 'eqeq',
        args: ctx.addition.map(add => this.visit(add))
      }
    }

    if (ctx.notequals) {
      return {
        type: 'neq',
        args: ctx.addition.map(add => this.visit(add))
      }
    }
    return ctx.addition.map(add => this.visit(add))
  }

  addition (ctx) {
    if (ctx.add) {
      return {
        type: 'addition',
        args: ctx.multiplication.map(arg => this.visit(arg))
      }
    }
    if (ctx.multiplication) {
      return this.visit(ctx.multiplication[0])
    }
  }

  multiplication (ctx) {
    if (ctx.mult) {
      return {
        type: 'multiplication',
        args: ctx.primary.map(arg => this.visit(arg))
      }
    }
    return this.visit(ctx.primary[0])
  }

  primary (ctx) {
    if (ctx.real) {
      return {
        type: 'real',
        value: ctx.real[0].image
      }
    }
    if (ctx.integer) {
      return {
        type: 'integer',
        value: ctx.integer[0].image
      }
    }
    if (ctx.identifier) {
      return {
        type: 'identifier',
        value: ctx.identifier[0].image
      }
    }
    if (ctx.functioncall) {
      return this.visit(ctx.functioncall[0])
    }
  }

  funccallparamlist (ctx) {
    return ctx
  }

  funcdeclarations (ctx) {
    let statements = []
    let variableDeclarations = []
    if (ctx.statement) {
      statements = ctx.statement.map(s => this.visit(s))
    }
    if (ctx.localvardeclaration) {
      variableDeclarations = ctx.localvardeclaration.map(s => this.visit(s))
    }
    return {
      name: ctx.identifier[0].image,
      statements,
      variableDeclarations
    }
  }

  exitwhenstatement (ctx) {
    return {
      type: 'exitwhen',
      expression: this.visit(ctx.expression)
    }
  }

  loopstatement (ctx) {
    let statements = []
    if (ctx.statement) {
      statements = ctx.statement.map(s => this.visit(s))
    }
    return {
      type: 'loopstatement',
      statements
    }
  }

  vardeclaration (ctx) {
    return {
      type: ctx.identifier[0].image,
      name: ctx.identifier[1].image,
      value: ctx.expression ? this.visit(ctx.expression) : null
    }
  }

  localvardeclaration (ctx) {
    return {
      type: 'localvardeclaration',
      declaration: this.visit(ctx.vardeclaration)
    }
  }
}

const visitor = new JassVisitor()

module.exports = {
  parse (inputstr) {
    return visitor.visit(parse(inputstr))
  }
}
