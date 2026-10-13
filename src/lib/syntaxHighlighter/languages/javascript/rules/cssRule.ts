import type { HLJSApi, Mode } from 'highlight.js';

type GetCssRuleProps = {
  hljs: HLJSApi;
  subst: Mode;
};

function getCssRule(props: GetCssRuleProps) {
  const { hljs, subst } = props;

  return {
    begin: '.?css`',
    end: '',
    starts: {
      end: '`',
      returnEnd: false,
      contains: [hljs.BACKSLASH_ESCAPE, subst],
      subLanguage: 'css',
    },
  };
}

export { getCssRule };
