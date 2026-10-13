import { QueryParser } from 'create-query-language';

const queryParser = new QueryParser();

type UseQueryParserProps = {
  query: string;
};

export function useQueryParser(props: UseQueryParserProps) {
  // Calls no hooks, so the compiler won't infer it as one without this directive.
  'use memo';

  const { query } = props;

  const parseResult = queryParser.parse(query);

  return parseResult;
}
