import { interpret } from './interpreter';
import { parse } from './parser';
import { tokenize } from './tokenizer';

describe('combat-lang', () => {
  it('should interpret test code', () => {
    const code = `
if (name == 'Bob') {
    print();
    print();
} else {
    dontprint();
}`;

    const tokens = tokenize(code);
    expect(tokens).toMatchSnapshot();
    const ast = parse(tokens);
    expect(ast).toMatchSnapshot();

    interpret(ast);
  });
});
