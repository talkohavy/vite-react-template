import type { HLJSApi, Mode } from 'highlight.js';

type GetGraphQlRuleProps = {
  hljs: HLJSApi;
  subst: Mode;
};

function getGraphQlRule(props: GetGraphQlRuleProps) {
  const { hljs, subst } = props;

  return {
    begin: '.?gql`',
    end: '',
    starts: {
      end: '`',
      returnEnd: false,
      contains: [hljs.BACKSLASH_ESCAPE, subst],
      subLanguage: 'graphql',
    },
  };
}

export { getGraphQlRule };
