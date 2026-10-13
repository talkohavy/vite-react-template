import type { HLJSApi, Mode } from 'highlight.js';

type GetHtmlRuleProps = {
  hljs: HLJSApi;
  subst: Mode;
};

function getHtmlRule(props: GetHtmlRuleProps) {
  const { hljs, subst } = props;

  return {
    begin: '.?html`',
    end: '',
    starts: {
      end: '`',
      returnEnd: false,
      contains: [hljs.BACKSLASH_ESCAPE, subst],
      subLanguage: 'xml',
    },
  };
}

export { getHtmlRule };
