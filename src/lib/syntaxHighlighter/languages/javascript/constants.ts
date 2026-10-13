import { GLOBAL_CLASSES, GLOBAL_FUNCTIONS, GLOBAL_VARIABLES, LITERALS } from './ecmaScript';
import { keywordGroup1 } from './rules/keywordGroup1';
import { keywordGroup2 } from './rules/keywordGroup2';

const IDENT_RE = '[A-Za-z$_][0-9A-Za-z$_]*';
const LOWERCASED_VARIABLE_RE = '[a-z][A-Za-z0-9$_]*';

// https://tc39.es/ecma262/#sec-literals-numeric-literals
const decimalDigits = '[0-9](_?[0-9])*';
const fraction = `\\.(${decimalDigits})`;
// DecimalIntegerLiteral, including Annex B NonOctalDecimalIntegerLiteral
// https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
const decimalInteger = '0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*';

const KEYWORDS = {
  $pattern: IDENT_RE,
  keyword: keywordGroup1,
  keyword2: keywordGroup2,
  literal: LITERALS,
  built_in: GLOBAL_FUNCTIONS.concat(GLOBAL_CLASSES),
  'variable.language': GLOBAL_VARIABLES,
};

export { IDENT_RE, KEYWORDS, LOWERCASED_VARIABLE_RE, decimalDigits, decimalInteger, fraction };
