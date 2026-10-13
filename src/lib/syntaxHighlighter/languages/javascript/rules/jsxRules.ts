import { findTagEnd } from '../helpers';
import { getXmlTagRules } from './xmlTags';

type GetJsxRulesProps = {
  keywords: Record<string, any>;
  /**
   * The rules to highlight a JSX `{...}` expression with.
   */
  expressionContains: Array<any>;
};

/**
 * JSX can only start where an expression can start, i.e. `return <div>`, `(<div>`, `= <div>`, `=> <div>`, `&& <div>`, `? <div>`.
 * This is what tells apart `a<b` (comparison) & `useState<Item>()` (generics) from `<b>` (JSX).
 */
const JSX_START_CONTEXT_RE = String.raw`(?<=(?:^|[=(,:?{[&|!]|=>|\b(?:return|case|throw|yield|default|await|else|do))\s*)`;
const TAG_NAME_RE = /[A-Za-z_$][\w$.:-]*/;

/**
 * @description
 * JSX elements, i.e.
 * - `<Suspense fallback={<Loader />}>...</Suspense>`
 * - `<Item key={item.id} {...item} />`
 * - `<>...</>`
 *
 * Tag names get the `name` scope, attributes get `attr`, and everything inside `{...}` is highlighted as JS.
 */
function getJsxRules(props: GetJsxRulesProps) {
  const { keywords, expressionContains } = props;

  const XML_TAG_RULES = getXmlTagRules();

  const EXPRESSION = {
    begin: /\{/,
    end: /\}/,
    beginScope: 'curly-brace',
    endScope: 'curly-brace',
    keywords,
    contains: expressionContains,
  };

  const HTML_ENTITY = { scope: 'symbol', begin: /&(?:[a-zA-Z0-9]+|#[0-9]+|#x[a-fA-F0-9]+);/ };

  const TAG_CONTAINS = [
    EXPRESSION,
    { scope: 'string', begin: /"/, end: /"/, contains: [HTML_ENTITY] },
    { scope: 'string', begin: /'/, end: /'/, contains: [HTML_ENTITY] },
    { scope: 'attr', begin: /[A-Za-z_$][\w$:-]*/, relevance: 0 },
  ];

  const CLOSING_TAG = {
    scope: 'tag',
    end: />/,
    contains: [{ scope: 'name', begin: new RegExp(`(?<=</)${TAG_NAME_RE.source}`) }],
  };

  // Everything between an opening tag & its closing tag.
  const CHILDREN = {
    end: /(?=<\/)/,
    contains: [EXPRESSION, HTML_ENTITY] as Array<any>,
    starts: CLOSING_TAG,
  };

  function createElementRules(contextRe: string) {
    const onOpeningTag = (expectSelfClosing: boolean) => (match: RegExpMatchArray, response: any) => {
      XML_TAG_RULES.isTrulyOpeningTag(match, response);
      if (response.isMatchIgnored) return;

      const tagEnd = findTagEnd({ input: match.input!, from: match.index! + match[0].length });
      if (tagEnd?.isSelfClosing !== expectSelfClosing) response.ignoreMatch();
    };

    const OPENING_TAG_BEGIN = [new RegExp(`${contextRe}<`), TAG_NAME_RE];

    const SELF_CLOSING_TAG = {
      scope: 'tag',
      begin: OPENING_TAG_BEGIN,
      beginScope: { 2: 'name' },
      'on:begin': onOpeningTag(true),
      end: /\/>/,
      contains: TAG_CONTAINS,
    };

    const OPENING_TAG = {
      scope: 'tag',
      begin: OPENING_TAG_BEGIN,
      beginScope: { 2: 'name' },
      'on:begin': onOpeningTag(false),
      end: />/,
      contains: TAG_CONTAINS,
      starts: CHILDREN,
    };

    const FRAGMENT = {
      scope: 'tag',
      begin: new RegExp(`${contextRe}<>`),
      starts: CHILDREN,
    };

    return [FRAGMENT, SELF_CLOSING_TAG, OPENING_TAG];
  }

  // Nested elements (i.e. `<li>` inside `<ul>`) need no start context.
  CHILDREN.contains.push(...createElementRules(''));

  return createElementRules(JSX_START_CONTEXT_RE);
}

export { getJsxRules };
