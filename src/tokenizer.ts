import type { Token } from './types';

function isWhitespace(char: string): boolean {
  return [' ', '\t', '\n', '\r'].includes(char);
}

function isLetter(char: string): boolean {
  return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
}

function isOperator(char: string): boolean {
  return ['=', '(', ')', '{', '}'].includes(char);
}

function isNumber(char: string): boolean {
  return char >= '0' && char <= '9';
}

function isSemiColon(char: string): boolean {
  return char === ';';
}

function isComment(char: string): boolean {
  return char === '#';
}

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let current = 0;

  while (current < input.length) {
    const char = input[current];

    if (isWhitespace(char)) {
      let value = char;

      current++;
      while (current < input.length && isWhitespace(input[current])) {
        value += input[current];
        current++;
      }

      // tokens.push({
      //   type: 'Whitespace',
      //   value,
      // });
      continue;
    }

    if (isSemiColon(char)) {
      tokens.push({
        type: 'SemiColon',
        value: char,
      });
      current++;
      continue;
    }

    if (isComment(char)) {
      let value = char;
      
      current++;
      while (current < input.length && input[current] !== '\n') {
        value += input[current];
        current++;
      }

      // tokens.push({
      //   type: 'Comment',
      //   value,
      // });
      continue;
    }

    if (isLetter(char)) {
      let value = char;

      current++;
      while (current < input.length && (isLetter(input[current]) || input[current] === '_')) {
        value += input[current];
        current++;
      }

      if (value === 'if' || value === 'else') {
        tokens.push({
          type: 'Keyword',
          value,
        });
      } else {
        tokens.push({
          type: 'Identifier',
          value,
        });
      }
      continue;
    }

    if (isNumber(char)) {
      let value = char;
      
      current++;

      while (current < input.length && isNumber(input[current])) {
        value += input[current];
        current++;
      }

      tokens.push({
        type: 'NumberLiteral',
        value,
      });
      continue;
    }

    if (char === "'") {
      let value = char;

      current++;
      while (current < input.length && input[current] !== "'") {
        value += input[current];
        current++;
      }
      value += input[current];
      current++;

      tokens.push({
        type: 'StringLiteral',
        value,
      });
      continue;
    }

    if (isOperator(char)) {
      let value = char;

      if (char === '=' && input[current + 1] === '=') {
        value += input[current + 1];
        current++;
      }

      current++;

      tokens.push({
        type: 'Operator',
        value,
      });
      continue;
    }

    current++;
  }

  return tokens;
}
