import type { ASTNode } from './types';

// Sample environment
const env = {
  name: 'Bob',
  print: () => console.log('Hello, Bob!'),
  dontprint: () => console.log('This is not Bob.'),
};

type InterpretResult = void | boolean | string | number;

export function interpret(node: ASTNode): InterpretResult {
  switch (node.type) {
    case 'Program': {
      let value;
      node.body.forEach((n) => {
        value = interpret(n);
      });
      return value;
    }
    case 'IfStatement': {
      const testValue = interpret(node.test);
      if (testValue) {
        return interpret(node.consequent);
      } else if (node.alternate) {
        return interpret(node.alternate);
      }
      break;
    }
    case 'BlockStatement': {
      let value;
      node.body.forEach((n) => {
        value = interpret(n);
      });
      return value;
    }
    case 'BinaryExpression': {
      const leftValue = interpret(node.left);
      const rightValue = interpret(node.right);
      switch (node.operator) {
        case '==':
          return leftValue === rightValue;
        // Add other binary operators as needed.
        default:
          throw new Error(`Unknown operator: ${node.operator}`);
      }
    }
    case 'CallExpression': {
      const callee = env[node.callee];
      if (typeof callee !== 'function') {
        throw new Error(`Not a function: ${node.callee}`);
      }
      return callee.apply(null, node.arguments.map(interpret)); // Interpret arguments and call function
    }
    case 'Identifier': {
      return env[node.name];
    }
    case 'StringLiteral': {
      return node.value.slice(1, -1); // Remove quotes
    }
    case 'NumberLiteral': {
      return Number(node.value);
    }
    default: {
      throw new Error(`Unknown node type`);
    }
  }
}
