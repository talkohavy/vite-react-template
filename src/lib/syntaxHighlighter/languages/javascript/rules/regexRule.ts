/**
 * A regex literal can only start where an expression can start, i.e. `= /re/`, `(/re/`, `return /re/`, `!/re/`.
 * This is what tells apart `/re/` from division (`a / b / c`).
 */
const REGEX_START_CONTEXT_RE = String.raw`(?<=(?:^|[=(,:?{[;!&|]|=>|\b(?:return|typeof|case|do|else|in|of|new|delete|void|throw|yield|await))\s*)`;

// `/`, then (any char but `/`, `\` or a newline | an escaped char | a [character class]), then `/` and the flags.
const REGEX_BODY_RE = String.raw`\/(?![*/])(?:[^/\\\n[]|\\.|\[(?:[^\]\\\n]|\\.)*\])+\/[dgimsuvy]*`;

const REGEX_RULE = {
  scope: 'regexp',
  begin: new RegExp(REGEX_START_CONTEXT_RE + REGEX_BODY_RE),
  relevance: 0,
};

export { REGEX_RULE };
