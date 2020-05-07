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
    let stmtToks = [
      Lexer.TOK_IF,
      Lexer.TOK_WHILE,
      Lexer.TOK_VAR,
      Lexer.TOK_FOR,
      Lexer.TOK_FUNC,
      Lexer.TOK_ID,
      Lexer_TOK_PRINT,
    ];
    let stmts = [];
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
    } else if(this.peek() === Lexer.TOK_IF) {
	this.consume(Lexer.TOK_IF) {
	exp = this.expr();
		this.consume(Lexer.TOK_DO);
		stmts = this.stmtList();
		if(this.peek() === Lexer.TOK_END)
			this.consume(Lexer.TOK_END);
		else {
			this.consume(Lexer.TOK_ELSE);
			let stmtsElse = this.stmtList();
			this.consume(Lexer.TOK_END);
		}
	}
    }
  }
}
