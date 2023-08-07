export type Token = {
  type: 'Keyword' | 'Identifier' | 'Operator' | 'StringLiteral' | 'NumberLiteral' | 'Whitespace' | 'SemiColon' | 'Comment'; 
  value: string;
};

export type ASTNode =
  | { type: 'Program'; body: ASTNode[] }
  | { type: 'IfStatement'; test: ASTNode; consequent: ASTNode; alternate: ASTNode | null }
  | { type: 'ElseIfStatement'; test: ASTNode; consequent: ASTNode; alternate: ASTNode | null }
  | { type: 'ElseStatement'; alternate: ASTNode }
  | { type: 'BlockStatement'; body: ASTNode[] }
  | { type: 'BinaryExpression'; operator: string; left: ASTNode; right: ASTNode }
  | { type: 'CallExpression'; callee: string; arguments: ASTNode[] }
  | { type: 'Identifier'; name: string }
  | { type: 'NumberLiteral'; value: string }
  | { type: 'StringLiteral'; value: string };

