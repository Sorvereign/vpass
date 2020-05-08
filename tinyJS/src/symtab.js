import Parser from "./parser";

export default class SymbolTable {
  build(nodes) {
    let self = this;
    nodes.forEach((node) => {
      self.analyzeNode(node);
    });
  }

  analyzeNode(node) {
    switch (node.nodetype) {
      case Parser.AST_DECL:
        this.putSymbol(node.left.value, node.left.type);
        this.analyzeNode(node.right);
        node.scope = this.peek();
        break;
      case Parser.AST_WHILE:
      case Parser.AST_IF:
      case Parser.AST_ELSE:
        if (node.exp !== undefined) this.analyzeNode(node.exp);
        this.scopeSymbolTable();
        node.scope = this.peek();
        this.build(node.stmts);
        this.pop();
        break;
      case Parser.AST_PRINT:
        this.analyzeNode(node.exp);
        break;
      case Parser.AST_BINOP:
        this.analyzeNode(node.left);
        this.analyzeNode(node.right);
        break;
      case Parser.AST_ASSIGN:
        this.analyzeNode(node.left);
        this.analyzeNode(node.right);
        break;
      case Parser.AST_ID:
        node.scope = this.peek();
        break;
    }
  }

  scopeSymbolTable() {
    let scope = new Scope(this.peek());
    this.stack.push(scope);
  }

  putSymbol(symbol, type) {
    this.peek().putSymbol(symbol, type);
  }

  getSymbol(symbol) {
    return this.peek().getSymbol(symbol);
  }

  peek() {
    return this.stack[this.stack.length - 1];
  }

  pop() {
    return this.stack.pop();
  }
}

export class Scope {
  constructor(parent) {
    this.table = {};
    this.parent = parent;
  }

  putSymbol(symbol, type) {
    if (this.getSymbol(symbol) !== undefined)
      throw new Error(`Can't redeclare variable ` + symbol);
    this.table[symbol] = type;
  }

  getSymbol(symbol) {
    if (this.table[symbol] === undefined && this.parent)
      return this.parent.getSymbol(symbol);
    return this.table[symbol];
  }
}
