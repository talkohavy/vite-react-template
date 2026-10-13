import { IDENT_RE } from '../constants';

type GetDeclarationNameRuleProps = {
  /**
   * The declaration keyword, i.e. `const|let` or `var`.
   */
  keywordRe: string;
  scope: string;
  keywords: Record<string, any>;
  /**
   * Rules to highlight a destructuring default value with (i.e. the `fn()` in `const { a = fn() } = props`).
   */
  valueContains: Array<any>;
};

/**
 * @description
 * Highlights the declared names right after `const`/`let`/`var`:
 * - `const name`
 * - `const { a, b: { c }, d = 5, ...rest }`
 * - `const [first, , third = 3]`
 *
 * It only covers the name/pattern itself, so it never runs past it (i.e. into a `for...of` body, a type annotation, or the next line).
 */
function getDeclarationNameRule(props: GetDeclarationNameRuleProps) {
  const { keywordRe, scope, keywords, valueContains } = props;

  // `[ \t]+` (not `\s+`), so `as const` at the end of a line does not grab the next line's first word.
  const AFTER_KEYWORD_RE = String.raw`(?<=(?<!\bas\s+)\b(?:${keywordRe})[ \t]+)`;

  const BINDING_NAME = { scope, begin: IDENT_RE, relevance: 0 };

  // The `key` in a renaming destructure: `const { key: newName } = props`
  const RENAMED_KEY = { scope: 'attr', begin: `${IDENT_RE}(?=\\s*:)`, relevance: 0 };

  // A default value ends at the first `,` `}` or `]` that is not nested inside one of these groups.
  const VALUE_GROUPS = {
    keywords,
    contains: [] as Array<any>,
    variants: [
      { begin: /\{/, end: /\}/, beginScope: 'curly-brace', endScope: 'curly-brace' },
      { begin: /\(/, end: /\)/, beginScope: 'parenthesis', endScope: 'parenthesis' },
      { begin: /\[/, end: /\]/, beginScope: 'array-bracket', endScope: 'array-bracket' },
    ],
  };
  VALUE_GROUPS.contains = [VALUE_GROUPS, ...valueContains];

  const DEFAULT_VALUE = {
    begin: /=/,
    end: /(?=[,}\]])/,
    keywords,
    contains: [VALUE_GROUPS, ...valueContains],
  };

  const OBJECT_PATTERN = {
    begin: /\{/,
    end: /\}/,
    beginScope: 'curly-brace',
    endScope: 'curly-brace',
    contains: [] as Array<any>,
  };

  const ARRAY_PATTERN = {
    begin: /\[/,
    end: /\]/,
    beginScope: 'array-bracket',
    endScope: 'array-bracket',
    contains: [] as Array<any>,
  };

  const PATTERN_CONTAINS = [OBJECT_PATTERN, ARRAY_PATTERN, DEFAULT_VALUE, RENAMED_KEY, BINDING_NAME];
  OBJECT_PATTERN.contains = PATTERN_CONTAINS;
  ARRAY_PATTERN.contains = PATTERN_CONTAINS;

  return {
    variants: [
      { ...OBJECT_PATTERN, begin: `${AFTER_KEYWORD_RE}\\{` },
      { ...ARRAY_PATTERN, begin: `${AFTER_KEYWORD_RE}\\[` },
      // `const enum Direction {}` is a TS enum, not a variable named `enum`.
      { scope, begin: `${AFTER_KEYWORD_RE}(?!enum\\b)${IDENT_RE}`, relevance: 0 },
    ],
  };
}

export { getDeclarationNameRule };
