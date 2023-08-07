import type { ASTNode, Token } from './types';

export function parse(tokens: Token[]): ASTNode {
  let current = 0;

  function walk(): ASTNode {
    let token = tokens[current];

    if (token.type === 'Whitespace') {
      current++;
      return walk();
    }

    if (token.type === 'StringLiteral') {
      current++;
      return {
        type: 'StringLiteral',
        value: token.value,
      };
    }

    if (token.type === 'NumberLiteral') {
      current++;
      return {
        type: 'NumberLiteral',
        value: token.value,
      };
    }

    // if (token.type === 'Operator' && token.value === '==') {
    //   current++;
    //   return {
    //     type: 'BinaryExpression',
    //     operator: '==',
    //     left: walk(),
    //     right: walk(),
    //   };
    // }

    if (token.type === 'Identifier') {
      current++;
      return {
        type: 'Identifier',
        name: token.value,
      };
    }

    if (token.type === 'Operator' && token.value === '(') {
      // Skip the '('
      token = tokens[++current];

      const node: ASTNode = {
        type: 'CallExpression',
        callee: token.value,
        arguments: [],
      };

      // Skip the function name
      token = tokens[++current];

      if (token.type !== 'Operator' || token.value !== ')') {
        // eslint-disable-next-line no-constant-condition
        while (true) {
          node.arguments.push(walk());
          token = tokens[current];
          if (token.type === 'Operator' && token.value === ')') {
            break;
          }
          // skip ',' if there are multiple arguments
          current++;
        }
      }

      current++; // Skip the ')'
      return node;
    }

    if (token.type === 'Keyword' && token.value === 'if') {
      token = tokens[++current];

      const testStart = tokens.findIndex((t, i) => i > current && t.value === '(') + 1;
      const testEnd = tokens.findIndex((t, i) => i > testStart && t.value === ')');

      current = testStart;
      const test = walk(); // This is naive. Assumes a simple condition.
      current = testEnd + 1;

      const consequentStart = tokens.findIndex((t, i) => i > current && t.value === '{') + 1;
      const consequentEnd = tokens.findIndex((t, i) => i > consequentStart && t.value === '}');

      current = consequentStart;
      const consequent = walk();
      current = consequentEnd + 1;

      let alternate = null;

      if (tokens[current] && tokens[current].value === 'else') {
        current++;

        const alternateStart = tokens.findIndex((t, i) => i > current && t.value === '{') + 1;
        const alternateEnd = tokens.findIndex((t, i) => i > alternateStart && t.value === '}');

        current = alternateStart;
        alternate = walk();
        current = alternateEnd + 1;
      }

      return {
        type: 'IfStatement',
        test,
        consequent,
        alternate,
      };
    }

    if (token.type === 'Keyword' && token.value === 'else') {
      token = tokens[++current];

      const alternateStart = tokens.findIndex((t, i) => i > current && t.value === '{') + 1;
      const alternateEnd = tokens.findIndex((t, i) => i > alternateStart && t.value === '}');

      current = alternateStart;
      const alternate = walk();
      current = alternateEnd + 1;

      return {
        type: 'BlockStatement',
        body: [alternate],
      };
    }

    if (token.type === 'Operator') {
      const left = walk();
      const operator = token.value;
      current++; // Skip operator
      const right = walk();

      return {
        type: 'BinaryExpression',
        operator,
        left,
        right,
      };
    }

    // If we haven't recognized the token type, throw an error
    throw new TypeError(token.type);
  }

  const ast: ASTNode = {
    type: 'Program',
    body: [],
  };

  while (current < tokens.length) {
    ast.body.push(walk());
  }

  return ast;
}
