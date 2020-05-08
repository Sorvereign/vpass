import Lexer from "./lexer";

class Parser {
  AST_STMT_LIST = 1;
  AST_ID = 2;
  AST_ASSIGN = 3;
  AST_INT = 4;
  AST_DECL = 5;
  AST_BOOL = 6;
  AST_STRING = 7;
  AST_FLOAT = 8;
  AST_BINOP = 9;
  AST_WHILE = 10;
  AST_IF = 11;
  AST_ELSE = 12;
  AST_PRINT = 13;

  ASTNode(args) {
    this.nodetype = args.nodetype;
    this.value = args.value;
    this.left = args.left;
    this.right = args.right;
    this.type = args.type;
    this.operator = args.operator;
    this.exp = args.exp;
    this.stmts = args.stmts;
  }

  parser(input) {
    this.tokens = Lexer.lex(input);
    return this.program();
  }
  program() {
    program = {
      nodetype: Parser.AST_STMT_LIST,
      node: this.stmtList(),
    };
    return program;
  }

  stmtList() {
    const stmtToks = [
      Lexer.TOK_IF,
      Lexer.TOK_WHILE,
      Lexer.TOK_VAR,
      Lexer.TOK_FOR,
      Lexer.TOK_FUNC,
      Lexer.TOK_ID,
      Lexer_TOK_PRINT,
    ];
    const stmts = [];
    while (this.tokens.length) {
      if (stmtToks.indexOf(this.peek()) > -1) stmts.push(this.stmt());
      else if (this.peek() === Lexer.TOK_END || this.peek() === Lexer.TOK_ELSE)
        break;
      else throw new Error(`Unexpected Token ${this.nextToken().value}`);
    }
    return stmts;
  }

  stmt() {
    let id;
    let left;
    let right;
    let type;
    let exp;
    let stmts;
    if (this.peek() === Lexer.TOK_ID) {
      id = this.consume(Lexer.TOK_ID);
      this.consume(Lexer.TOK_EQ);
      right = this.expr();
      left = new ASTNode({ nodetype: Parser.AST_ID, value: id.value });
      this.consume(Lexer.TOK_SEMI);
      return new ASTNode({
        nodetype: Parser.AST_ASSIGN,
        left: left,
        right: right,
      });
    } else if (this.peek() === lexer.TOK_VAR) {
      this.consume(Lexer.TOK_VAR);
      id = this.consume(Lexer.TOK_ID);
      this.consume(Lexer.TOK_COLON);
      type = this.consume(Lexer.TOK_TYPE);
      left = new ASTNode({
        nodetype: Parser.AST_ID,
        type: type.value,
        value: id.value,
      });
      this.consume(Lexer.TOK_EQ);
      right = this.expr();
      this.consume(Lexer.TOK_SEMI);
      return new ASTNode({
        nodetype: Parser.AST_DECL,
        left: left,
        right: right,
      });
    } else if (this.peek() === Lexer.TOK_WHILE) {
      this.consume(Lexer.TOK_WHILE);
      exp = this.expr();
      this.consume(Lexer.TOK_DO);
      stmts = this.stmtList();
      this.consume(Lexer.TOK_END);
      return new ASTNode({
        nodetype: Parser.AST_WHILE,
        exp: exp,
        stmts: stmts,
      });
    } else if (this.peek() === Lexer.TOK_IF) {
      this.consume(Lexer.TOK_IF);
      exp = this.expr();
      this.consume(Lexer.TOK_DO);
      stmts = this.stmtList();
      if (this.peek() === Lexer.TOK_END) this.consume(Lexer.TOK_END);
      else {
        this.consume(Lexer.TOK_ELSE);
        let stmtsElse = this.stmtList();
        this.consume(Lexer.TOK_END);
        stmts.push(
          new ASTNode({ nodetype: Parser.AST_ELSE, stmts: stmtsElse })
        );
      }
      return new ASTNode({ nodetype: Parser.AST_IF, exp: exp, stmts: stmts });
    } else if (this.peek() === Lexer.TOK_PRINT) {
      this.consume(Lexer.TOK_PRINT);
      exp = this.expr();
      this.consume(Lexer.TOK_SEMI);
      return new ASTNode({ nodetype: Parser.AST_PRINT, exp: exp });
    }
  }
  expr() {
    let t = this.term();
    let tRight;
    let nextToken = this.peek();
    let opToks = [
      Lexer.TOK_PLUS,
      Lexer.TOK_MINUS,
      Lexer.TOK_AND,
      Lexer.TOK_OR,
      Lexer.TOK_EQLS,
      Lexer.TOK_NEQLS,
      Lexer.TOK_LTHAN,
      Lexer.GTHAN,
    ];
    while (this.tokens.length && opToks.indexOf(this.peek()) > -1) {
      if (nextToken === Lexer.TOK_PLUS) {
        this.consume(Lexer.TOK_PLUS);
        tRight = this.term();
        t = new ASTNode({
          nodetype: Parser.AST_BINOP,
          operator: "+",
          left: t,
          right: tRight,
        });
      } else if (nextToken === Lexer.TOK_MINUS) {
        this.consume(Lexer.TOK_MINUS);
        tRight = this.term();
        t = new ASTNode({
          nodetype: Parser.AST_BINOP,
          operator: "-",
          left: t,
          right: tRight,
        });
      } else if (nextToken === Lexer.TOK_OR) {
        this.consume(Lexer.TOK_OR);
        tRight = this.term();
        t = new ASTNode({nodetype: Parser.AST_BINOP, operator: "||", left: t,  right: tRight});
      } else if (nextToken == Lexer.TOK_AND) {
        this.consume(Lexer.TOK_AND);
        tRight = this.term();
        t = new ASTNode({nodetype: Parser.AST_BINOP, operator: "&&", left: t, right: tRight});
      } else if (nextToken === Lexer.TOK_EQLS) {
          this.consume(Lexer.TOK_EQLS);
          tRight = this.term();
          t = new ASTNode({nodetype: Parser.AST_BINOP, operator: "==", left: t, right: tRight});
      } else if (nextToken === Lexer.TOK_NEQLS) {
          this.consume(Lexer.TOK_NEQLS);
          tRight = this.term();
          t = new ASTNode({nodetype: Parser.AST_BINOP, operator: "!=", left: t, right: tRight});
      } else if (nextToken === Lexer.TOK_LTHAN) {
          this.consume(Lexer.TOK_LTHAN);
          tRight = this.term();
          t = new ASTNOde({nodetype: Parser.AST_BINOP, operator: "<", left: t, right: tRight});
      } else if (nextToken === Lexer.TOK_GTHAN) {
          this.consume(Lexer.TOK_GTHAN);
          tRight = this.term();
          t = new ASTNode({nodetype: Parser.AST_BINOP, operator: ">", left: t, right: tRight});
      }
      nextToken = this.peek();
    }
    return t;
  }

  term() {
    let f = this.factor();
    let fRight;
    let nextToken = this.peek();
    while (this.tokens.length && nextToken === Lexer.TOK_STAR || nextToken === Lexer.TOK_SLASH || nextToken === Lexer.TOK_MOD) {
      if (nextToken === Lexer.TOK_STAR) {
        this.consume(Lexer.TOK_STAR);
        fRight = this.factor();
        f = new ASTNode({nodetype: Parser.AST_BINOP, operator: "*", left: f, right: fRight});
      } else if (nextToken === Lexer.TOK_SLASH) {
        this.consume(Lexer.TOK_SLASH);
        fRight = this.factor();
        f = new ASTNode({nodetype: Parser.AST_BINOP, operator: "/", left: f, right: fRight}); 
      } else if (nextToken === Lexer.TOK_MOD) {
        this.consume(Lexer.TOK_MOD);
        fRight = this.factor();
        f = new ASTNode({nodetype: Parser.AST_BINOP, operator: "%", left: f, right: fRigth});
      } 
      nextToken = this.peek();
    }
    return f;
  }

  factor() {
    let f;
    if (this.peek() === Lexer.TOK_INT) {
      f = this.consume(Lexer.TOK_INT);
      return new ASTNode({nodetype: Parser.AST_INT, value: f.value});
    } else if (this.peek() === Lexer.TOK_BOOL) {
      f = this.consume(Lexer.TOK_BOOL);
      return new ASTNode({nodetype: Parser.AST_BOOL, value: f.value});
    } else if (this.peek() === Lexer.TOK_STRING) {
      f = this.consume(Lexer.TOK_STRING);
      return new ASTNode({nodetype: Parser.AST_STRING, value: f.value}); 
    } else if (this.peek() === Lexer.TOK_FLOAT) {
      f = this.consume(Lexer.TOK_FLOAT);
      return new ASTNode({nodetype: Parser.AST_FLOAT, value: f.value });
    } else if (this.peek() === Lexer.TOK_ID) {
      f = this.consume(Lexer.TOK_ID);
      return new ASTNode({nodetype: Parser.AST_ID, value: f.value});
    } else if (this.peek() === Lexer.TOK_LPAREN) {
      this.consume(Lexer.TOK_LPAREN);
      let e = this.expr();
      this.consume(Lexer.TOK_RPAREN);
      return e;
    }
  }

  nextToken() {
    return this.tokens.shift();
  }

  peek() {
    return this.tokens.length ? this.tokens[0].type : null;
  }

  consume() {
    if (!this.tokens.length) {
      throw new Error("Expecting a token but EOF found");
  } if (tokType === this.peek()) {
    return thi.nextToken();
  } else {
    throw new Error(`Unexpected Token ${this.tokens[0].value}`);
  }
}