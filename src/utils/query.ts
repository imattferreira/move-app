
export function sql(expressions: TemplateStringsArray): string {
  let inlined = '';

  for (const expr of expressions) {
    if (expr.trim() === '\n') {
      continue;
    }

    inlined += expr
      .replace(/\s+/g, ' ')
      .replace(/\n/g, '')
      .replace(/\(\s/g, '(')
      .replace(/\s\)/g, ')')
      .trim();
  }

  return inlined;
}
