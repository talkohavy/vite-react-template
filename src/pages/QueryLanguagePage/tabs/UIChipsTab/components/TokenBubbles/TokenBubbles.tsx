import clsx from 'clsx';
import { TokenTypes, type Token } from 'create-query-language';
import TokenLegend from './content/TokenLegend';
import { TOKEN_TYPE_TO_COLOR } from './logic/constants';
import type { ColorableTokenTypes } from './types';

function splitTokensAtFirstError(props: { tokens: Token[]; firstErrorTokenIndex?: number }) {
  const { tokens, firstErrorTokenIndex } = props;

  if (firstErrorTokenIndex == null) {
    return { validTokens: tokens, errorTokens: [] };
  }

  const validTokens: Token[] = [];
  const errorTokens: Token[] = [];

  tokens.forEach((token, index) => {
    if (token.type === TokenTypes.EndOfLine) return;

    if (index < firstErrorTokenIndex) {
      validTokens.push(token);
    } else {
      if (errorTokens.length === 0) {
        errorTokens.push(token);
      }
    }
  });

  return { validTokens, errorTokens };
}

type TokenBubblesProps = {
  tokens: Token[];
  firstErrorTokenIndex?: number;
};

export default function TokenBubbles(props: TokenBubblesProps) {
  const { tokens, firstErrorTokenIndex } = props;

  const filteredTokens = tokens.filter(
    (token) => ![TokenTypes.Whitespace, TokenTypes.EndOfLine].includes(token.type as any),
  );

  const { validTokens, errorTokens } = splitTokensAtFirstError({ tokens: filteredTokens, firstErrorTokenIndex });

  return (
    <div className='mt-4'>
      <h3 className='text-sm font-medium text-gray-600 dark:text-gray-300 mb-2'>Query Tokens</h3>

      <div className='flex gap-2 items-center overflow-auto'>
        {validTokens.map((token, index) => {
          const { backgroundColor, color } = TOKEN_TYPE_TO_COLOR[token.type as ColorableTokenTypes] || {};

          return (
            <span
              key={`${token.position.start}-${token.position.end}-${index}`}
              className={clsx(
                'inline-flex items-center h-6 px-2.5 py-1 rounded-lg text-xs font-mono font-medium',
                backgroundColor,
                color,
              )}
              title={`Type: ${token.type}, Position: ${token.position.start}-${token.position.end}`}
            >
              <span className='select-none'>{token.value}</span>
            </span>
          );
        })}

        {errorTokens.map((token, index) => {
          const { backgroundColor, color } = TOKEN_TYPE_TO_COLOR[TokenTypes.Invalid];

          return (
            <span
              key={`${token.position.start}-${token.position.end}-${index}`}
              className={clsx(
                'inline-flex items-center h-6 px-2.5 py-1 rounded-lg text-xs font-medium',
                backgroundColor,
                color,
              )}
              title={`Type: ${token.type}, Position: ${token.position.start}-${token.position.end}(Error detected)`}
            >
              <span className='select-none'>{token.value}</span>

              <svg className='ml-1 w-3 h-3' stroke='none' viewBox='0 0 20 20'>
                <circle cx='10' cy='10' r='8' fill='#ff6e6e' />
                <rect x='9' y='6' width='2' height='5' rx='1' fill='white' />
                <circle cx='10' cy='14' r='1' fill='white' />
              </svg>
            </span>
          );
        })}

        {validTokens.length > 0 && (
          <div className='ml-auto text-xs text-gray-400'>
            {validTokens.length} token{validTokens.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <TokenLegend />
    </div>
  );
}
