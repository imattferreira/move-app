
export function sql(expressions: TemplateStringsArray): string {
  let statement = '';

  for (const expr of expressions) {
    if (expr.trim() === '\n') {
      continue;
    }

    statement += expr
      .replace(/\s+/g, ' ')
      .replace(/\n/g, '')
      .replace(/\(\s/g, '(')
      .replace(/\s\)/g, ')')
      .trim();
  }

  return statement;
}
