import type { HLJSApi, Mode } from 'highlight.js';

type GetStringLiteralRuleProps = {
  hljs: HLJSApi;
  subst: Mode;
};

function getStringLiteralRule(props: GetStringLiteralRuleProps) {
  const { hljs, subst } = props;

  return {
    scope: 'string',
    begin: '`',
    end: '`',
    contains: [hljs.BACKSLASH_ESCAPE, subst],
  };
}

export { getStringLiteralRule };
