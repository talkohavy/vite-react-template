/*
Language: JavaScript
Description: JavaScript (JS) is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions.
Category: common, scripting, web
Website: https://developer.mozilla.org/en-US/docs/Web/JavaScript
*/

// import * as ECMAScript from '../ecmascript';
import { IDENT_RE, KEYWORDS } from './constants';
import { ARRAY_BRACKET_RULE } from './rules/arrayBracketsRule';
import { ARROW_RULE } from './rules/arrowRule';
import { getClassAndExtendsRule } from './rules/classAndExtendsRules';
import { CLASS_CALL_RULE } from './rules/classCallRule';
import { getCommentRule } from './rules/commentRule';
import { getCssRule } from './rules/cssRule';
import { CURLY_BRACES_RULE } from './rules/curlyBracesRule';
import { getDeclarationNameRule } from './rules/declarationNameRule';
import { getFunctionCallRule } from './rules/functionCallRule';
import { FUNCTION_NAME_RULE } from './rules/functionNameRule';
import { FUNCTION_VARIABLE_RULE } from './rules/functionVariableRule';
import { getGraphQlRule } from './rules/graphQlRule';
import { getHtmlRule } from './rules/htmlRule';
import { getJsxRules } from './rules/jsxRules';
import { NUMBER_RULE } from './rules/numberRule';
import { PARENTHESIS_RULE } from './rules/parenthesisRule';
import { REGEX_RULE } from './rules/regexRule';
import { getStringLiteralRule } from './rules/stringLiteralRule';
import { USE_STRICT_RULE } from './rules/useStrictRule';

export function javascriptLanguageToRegister(hljs: any) {
  const { regex } = hljs;

  // A fresh copy per language, so that TypeScript can extend it without leaking into JavaScript.
  const keywords = { ...KEYWORDS };

  // The rules for an embedded expression (`${...}` & JSX `{...}`). Filled in once all the rules are defined.
  const EXPRESSION_CONTAINS: Array<any> = [];

  const SUBST = {
    scope: 'subst',
    begin: /\$\{/,
    end: /\}/,
    keywords,
    contains: EXPRESSION_CONTAINS,
  };

  // Inside an embedded expression, braces must be balanced, so the first `}` does not end the expression.
  const BALANCED_CURLY_BRACES = {
    begin: /\{/,
    end: /\}/,
    beginScope: 'curly-brace',
    endScope: 'curly-brace',
    keywords,
    contains: EXPRESSION_CONTAINS,
  };

  const JSX_RULES = getJsxRules({ keywords, expressionContains: EXPRESSION_CONTAINS });
  const HTML_TEMPLATE_RULE = getHtmlRule({ hljs, subst: SUBST });
  const CSS_TEMPLATE_RULE = getCssRule({ hljs, subst: SUBST });
  const TEMPLATE_STRING = getStringLiteralRule({ hljs, subst: SUBST });
  const COMMENT_RULE = getCommentRule(hljs);
  const CLASS_AND_EXTENDS_RULE = getClassAndExtendsRule(hljs);
  const FUNCTION_CALL_RULE = getFunctionCallRule(hljs);
  const GRAPHQL_TEMPLATE_RULE = getGraphQlRule({ hljs, subst: SUBST });

  const PROPERTY_ACCESS = {
    begin: regex.concat(/\./, regex.lookahead(regex.concat(IDENT_RE, /(?![0-9A-Za-z$_(])/))),
    end: IDENT_RE,
    excludeBegin: true,
    keywords: 'prototype',
    scope: 'property',
    relevance: 0,
  };

  const DECLARATION_VALUE_CONTAINS = [
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE,
    TEMPLATE_STRING,
    COMMENT_RULE,
    NUMBER_RULE,
    FUNCTION_CALL_RULE,
    ARROW_RULE,
    PROPERTY_ACCESS,
  ];

  // Catches "const aaa = 5" as well as "const {a,b,c} = props"
  const CONST_AND_LET_VARIABLE_NAME_RULE = getDeclarationNameRule({
    keywordRe: 'const|let',
    scope: 'title.variable',
    keywords,
    valueContains: DECLARATION_VALUE_CONTAINS,
  });

  const VAR_VARIABLE_NAME_RULE = getDeclarationNameRule({
    keywordRe: 'var',
    scope: 'var-variable-name',
    keywords,
    valueContains: DECLARATION_VALUE_CONTAINS,
  });

  const contains = [
      hljs.SHEBANG({
        label: 'shebang',
        binary: 'node',
        relevance: 5,
      }),
      USE_STRICT_RULE,
      FUNCTION_NAME_RULE,
      FUNCTION_VARIABLE_RULE,
      CONST_AND_LET_VARIABLE_NAME_RULE,
      VAR_VARIABLE_NAME_RULE,
      CURLY_BRACES_RULE,
      PARENTHESIS_RULE,
      ARRAY_BRACKET_RULE,
      CLASS_CALL_RULE,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      HTML_TEMPLATE_RULE,
      CSS_TEMPLATE_RULE,
      COMMENT_RULE,
      REGEX_RULE,
      NUMBER_RULE,
      FUNCTION_CALL_RULE,
      ARROW_RULE,
      CLASS_AND_EXTENDS_RULE,
      ...JSX_RULES,
      GRAPHQL_TEMPLATE_RULE,
      TEMPLATE_STRING,
      {
        // `key:` & `key?:`, but not a ternary's `cond ? a: b` or a `case FOO:`
        scope: 'attr',
        begin: regex.concat(/(?<![\w$])(?<!\?[ \t]*|\bcase[ \t]+)/, IDENT_RE, regex.lookahead(/\??:/)),
        relevance: 0,
      },
      // catch ... so it won't trigger the property rule below
      {
        match: /\.\.\./,
        relevance: 0,
      },
      PROPERTY_ACCESS,
      {
        match: /\$[(.]/, // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      },
      // The UPPERCASE_CONSTANT_RULE:
      // - Makes JSON appear as white instead of green (which is what VSCode does):
      // {
      //   relevance: 0,
      //   match: /\b[A-Z][A-Z_0-9]+\b/,
      //   scope: 'variable.constant',
      // },
  ];

  EXPRESSION_CONTAINS.push(...contains.filter((rule) => rule !== CURLY_BRACES_RULE), BALANCED_CURLY_BRACES);

  return {
    name: 'JavaScript',
    case_insensitive: false, // <--- JavaScript language is case-sensitive! defaults to `false`.
    aliases: ['js', 'jsx', 'mjs', 'cjs'],
    keywords,
    // this will be extended by TypeScript
    exports: { EXPRESSION_CONTAINS },
    illegal: /#(?![$_A-z])/,
    contains,
  };
}
