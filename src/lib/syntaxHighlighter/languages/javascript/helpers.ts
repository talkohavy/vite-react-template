/**
 * @description
 * Takes a string like "<Booger" and checks to see
 * if we can find a matching "</Booger" later in the
 * content.
 */
export const hasClosingTag = (match: RegExpMatchArray, { after }: { after: number }) => {
  const tag = `</${match[0].slice(1)}`;
  const pos = match.input!.indexOf(tag, after);
  return pos !== -1;
};

type FindTagEndProps = {
  input: string;
  /**
   * The index right after the tag's name, i.e. right after `<Suspense`.
   */
  from: number;
};

/**
 * @description
 * Scans a JSX opening tag (skipping over `{...}` expressions and quoted strings) to find its closing `>`.
 *
 * Returns `null` when this is not a valid opening tag.
 */
export function findTagEnd(props: FindTagEndProps) {
  const { input, from } = props;

  let depth = 0;
  let quote: string | null = null;

  for (let i = from; i < input.length; i++) {
    const char = input[i];

    if (quote) {
      if (char === '\\') i++;
      else if (char === quote) quote = null;
      continue;
    }

    const isInsideExpression = depth > 0;

    if (isInsideExpression && input.startsWith('//', i)) {
      const lineEnd = input.indexOf('\n', i);
      if (lineEnd === -1) return null;
      i = lineEnd;
    } else if (isInsideExpression && input.startsWith('/*', i)) {
      const commentEnd = input.indexOf('*/', i + 2);
      if (commentEnd === -1) return null;
      i = commentEnd + 1;
    } else if (char === '"' || char === "'" || char === '`') {
      quote = char;
    } else if (char === '{') {
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth < 0) return null;
    } else if (depth === 0) {
      if (char === '<') return null;
      if (char === '>') {
        const isSelfClosing = input.slice(from, i).trimEnd().endsWith('/');
        return { isSelfClosing };
      }
    }
  }

  return null;
}
