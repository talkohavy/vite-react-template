import { ASTUtils, type ParseResult } from 'create-query-language';

function findInnermostASTNode(props: { ast: NonNullable<ParseResult['ast']>; cursorPosition: number }) {
  const { ast, cursorPosition } = props;

  let foundNode: any = null;

  // Use ASTBuilder's traverseAST method instead of our own recursive function
  ASTUtils.traverseAST(ast, null, (node: any, _parent: any): boolean => {
    // Check if cursor position is within this node
    if (cursorPosition >= node.position.start && cursorPosition <= node.position.end) {
      // Update the found node if this one is more specific (smaller range)
      if (!foundNode || node.position.end - node.position.start < foundNode.position.end - foundNode.position.start) {
        foundNode = node;
      }
      // Continue drilling down to find more specific nodes
      return true;
    }
    // Don't drill down into nodes that don't contain the cursor
    return false;
  });

  return foundNode;
}

type UsePositionInfoLogicProps = {
  cursorPosition?: number;
  result: ParseResult;
};

export function usePositionInfoLogic(props: UsePositionInfoLogicProps) {
  // Calls no hooks, so the compiler won't infer it as one without this directive.
  'use memo';

  const { cursorPosition = 0, result } = props;

  const currentToken =
    result.tokens.find((token) => cursorPosition >= token.position.start && cursorPosition <= token.position.end) ||
    null;

  // Find current AST node based on cursor position
  const currentASTNode =
    result.success && result.ast ? findInnermostASTNode({ ast: result.ast, cursorPosition }) : null;

  return { currentToken, currentASTNode };
}
