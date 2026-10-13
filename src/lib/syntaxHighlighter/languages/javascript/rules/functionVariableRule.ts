import { IDENT_RE } from '../constants';

const BALANCED_PARAMS_RE = String.raw`\([^()]*(?:\([^()]*\)[^()]*)*\)`;
const RETURN_TYPE_RE = String.raw`(?::[^=;{}]+)?`;
const IS_FUNCTION_VALUE_RE = new RegExp(
  String.raw`(?=(?:async\s*)?(?:function\b|${BALANCED_PARAMS_RE}\s*${RETURN_TYPE_RE}=>|${IDENT_RE}\s*=>|<[^>]*>\s*\())`,
);

const FUNCTION_VARIABLE_RULE = {
  match: [
    /\b(?:const|var|let)/,
    /\s+/,
    IDENT_RE,
    /(?:\s*:[^=;]+?)?\s*/, // optional type annotation, i.e. `const Comp: FC = () => {}`
    /=\s*/,
    new RegExp(String.raw`(?:(?:function|async)\s*)?${IS_FUNCTION_VALUE_RE.source}`),
  ],
  scope: {
    1: 'keyword2',
    3: 'title.function',
  },
  contains: [],
};

export { FUNCTION_VARIABLE_RULE };
