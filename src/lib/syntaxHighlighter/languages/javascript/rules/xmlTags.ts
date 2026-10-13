import { hasClosingTag } from '../helpers';

function getXmlTagRules() {
  return {
    /**
     * @param {RegExpMatchArray} match
     * @param {import('highlight.js').CallbackResponse} response
     */
    isTrulyOpeningTag: (match: any, response: any) => {
      const afterMatchIndex = match[0].length + match.index;
      const nextChar = match.input[afterMatchIndex];
      if (
        // HTML should not include another raw `<` inside a tag
        // nested type?
        // `<Array<Array<number>>`, etc.
        nextChar === '<' ||
        // the , gives away that this is not HTML
        // `<T, A extends keyof T, V>`
        nextChar === ','
      ) {
        return void response.ignoreMatch();
      }

      // `<something>`
      // Quite possibly a tag, lets look for a matching closing tag...
      if (nextChar === '>') {
        // if we cannot find a matching closing tag, then we
        // will ignore it
        if (!hasClosingTag(match, { after: afterMatchIndex })) return void response.ignoreMatch();
      }

      // `<blah />` (self-closing)
      // handled by simpleSelfClosing rule

      let m: any;
      const afterMatch = match.input.substring(afterMatchIndex);

      // some more template typing stuff
      //  <T = any>(key?: string) => Modify<
      if (afterMatch.match(/^\s*=/)) return void response.ignoreMatch();

      // `<From extends string>`
      // technically this could be HTML, but it smells like a type
      // NOTE: This is ugh, but added specifically for https://github.com/highlightjs/highlight.js/issues/3276
      if ((m = afterMatch.match(/^\s+extends\s+/))) {
        if (m.index === 0) {
          response.ignoreMatch();

          return;
        }
      }
    },
  };
}

export { getXmlTagRules };
