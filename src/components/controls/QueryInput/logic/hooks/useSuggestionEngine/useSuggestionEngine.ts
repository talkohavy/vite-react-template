import { ContextTypes, TokenTypes, type Token, type TokenContext } from 'create-query-language';
import { TOKEN_TYPE_HANDLERS } from './logic/tokenTypeToHandlerMapper';
import type { CompletionItem, KeyConfig } from '../../../types';

type UseSuggestionEngineProps = {
  tokens: Token[];
  cursorPosition: number;
  keyConfigs: KeyConfig[];
};

type GenerateCompletionsProps = {
  context: TokenContext | undefined;
  currentInput: string;
  keyConfigs: KeyConfig[];
};

function generateCompletions(props: GenerateCompletionsProps): CompletionItem[] {
  const { context, currentInput, keyConfigs } = props;

  if (!context) return [];

  let completions: CompletionItem[] = [];

  context.expectedTokens.forEach((type) => {
    const getCompletions = TOKEN_TYPE_HANDLERS[type];

    const completionsForType = getCompletions({ keyConfigs, currentInput, context });

    completions = completions.concat(completionsForType);
  });

  const completionsSorted = completions.toSorted((a, b) => b.priority - a.priority);

  return completionsSorted;
}

function getSuggestions(props: UseSuggestionEngineProps) {
  const { tokens, keyConfigs, cursorPosition } = props;

  try {
    // Find the first error token (Invalid type or where parsing fails)
    const visibleTokens = tokens.filter((token) => token.type !== TokenTypes.Whitespace);
    const firstErrorIndex = visibleTokens.findIndex((token) => token.type === TokenTypes.Invalid);

    const tokenAtCursor = tokens.find(
      (token) => cursorPosition >= token.position.start && cursorPosition <= token.position.end,
    );

    const currentToken =
      !tokenAtCursor || tokenAtCursor.type === TokenTypes.EndOfLine
        ? ({
            ...(tokenAtCursor ?? { type: TokenTypes.EndOfLine, value: '' }),
            context: { expectedTokens: [ContextTypes.Key, ContextTypes.LeftParenthesis, ContextTypes.Not] },
          } as Token)
        : tokenAtCursor;

    const context = currentToken.context;
    const expectedTypes: string[] = context?.expectedTokens ? [...context.expectedTokens] : [];

    const currentInput = currentToken.value.trim() ?? '';
    const completions = generateCompletions({ context, currentInput, keyConfigs });

    return {
      completions,
      expectedTypes,
      firstErrorTokenIndex: firstErrorIndex >= 0 ? firstErrorIndex : undefined,
    };
  } catch (error) {
    console.error('Error getting completions:', error);

    return { completions: [], expectedTypes: [], tokens: [], firstErrorTokenIndex: undefined };
  }
}

export function useSuggestionEngine(props: UseSuggestionEngineProps) {
  // Calls no hooks, so the compiler won't infer it as one without this directive.
  'use memo';
  const { tokens, keyConfigs, cursorPosition } = props;

  const { completions, expectedTypes, firstErrorTokenIndex } = getSuggestions({ tokens, keyConfigs, cursorPosition });

  return { completions, expectedTypes, firstErrorTokenIndex };
}
