const FUNCTION_NAME_RULE = {
  scope: 'title.function',
  // `function name` & `function* name`
  begin: /(?<=\bfunction(?:\s*\*\s*|\s+))[A-Za-z$_][0-9A-Za-z$_]*/,
};

export { FUNCTION_NAME_RULE };
