import hljs from 'highlight.js';
import { describe, expect, it } from 'vite-plus/test';
import { javascriptLanguageToRegister } from './languages/javascript';
import { typescriptLanguageToRegister } from './languages/typescript';

hljs.registerLanguage('javascript', javascriptLanguageToRegister);
hljs.registerLanguage('typescript', typescriptLanguageToRegister);

type HighlightProps = {
  code: string;
  language?: 'typescript' | 'javascript';
};

/**
 * Turns hljs's html output into a compact, readable form: `<span class="hljs-name">div</span>` becomes `[name|div]`.
 */
function highlight(props: HighlightProps) {
  const { code, language = 'typescript' } = props;

  const { value: html } = hljs.highlight(code, { language, ignoreIllegals: true });

  const compactResult = html
    .replace(/<span class="([^"]+)">/g, (_match, className: string) => `[${className.replace(/hljs-/g, '')}|`)
    .replace(/<\/span>/g, ']')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&');

  return compactResult;
}

describe('syntaxHighlighter', () => {
  describe('JSX', () => {
    it('should highlight a JSX element passed as a prop as a tag', () => {
      const expectedResult =
        '[tag|<[name|Suspense] [attr|fallback]=[curly-brace|{][tag|<[name|Loader] />][curly-brace|}]>][tag|</[name|Suspense]>]';
      const actualResult = highlight({ code: '<Suspense fallback={<Loader />}></Suspense>' });

      expect(actualResult).toEqual(expectedResult);
    });

    it('should highlight a JSX child expression as JS', () => {
      const expectedResult =
        '[tag|<[name|ul]>][curly-brace|{]items.[title function_ call__|map][parenthesis|(][parenthesis|(]item[parenthesis|)] [arrow|=>] [tag|<[name|Item] />][parenthesis|)][curly-brace|}][tag|</[name|ul]>]';
      const actualResult = highlight({ code: '<ul>{items.map((item) => <Item />)}</ul>' });

      expect(actualResult).toEqual(expectedResult);
    });

    it('should not end a tag on the ">" of an arrow function inside an attribute', () => {
      const expectedResult =
        '[tag|<[name|button] [attr|onClick]=[curly-brace|{][parenthesis|(][parenthesis|)] [arrow|=>] [title function_ call__|open][parenthesis|(]count > [number|1][parenthesis|)][curly-brace|}]>]Open[tag|</[name|button]>]';
      const actualResult = highlight({ code: '<button onClick={() => open(count > 1)}>Open</button>' });

      expect(actualResult).toEqual(expectedResult);
    });

    it('should leave apostrophes & "<" in JSX text as plain text', () => {
      const expectedResult = "[tag|<[name|p]>]Don't stop, a < b[tag|</[name|p]>]";
      const actualResult = highlight({ code: "<p>Don't stop, a < b</p>" });

      expect(actualResult).toEqual(expectedResult);
    });

    it('should highlight a JSX comment as a comment', () => {
      const expectedResult =
        '[tag|<[name|div]>][curly-brace|{][comment|/* <Old /> */][curly-brace|}][tag|</[name|div]>]';
      const actualResult = highlight({ code: '<div>{/* <Old /> */}</div>' });

      expect(actualResult).toEqual(expectedResult);
    });

    it('should recognize a tag whose attributes contain a comment with an apostrophe', () => {
      const expectedResult =
        "[tag|<[name|A] [attr|onClick]=[curly-brace|{][parenthesis|(][parenthesis|)] [arrow|=>] [curly-brace|{] [comment|// it's fine]\n[curly-brace|}][curly-brace|}] />]";
      const actualResult = highlight({ code: "<A onClick={() => { // it's fine\n}} />" });

      expect(actualResult).toEqual(expectedResult);
    });

    it('should highlight a fragment', () => {
      const expectedResult = '[keyword|return] [tag|<>][tag|<[name|Child] />][tag|</>]';
      const actualResult = highlight({ code: 'return <><Child /></>' });

      expect(actualResult).toEqual(expectedResult);
    });

    it('should not treat a comparison without spaces as a tag', () => {
      const expectedResult =
        '[keyword|if] [parenthesis|(]a<b && c>d[parenthesis|)] [title function_ call__|run][parenthesis|(][parenthesis|)];';
      const actualResult = highlight({ code: 'if (a<b && c>d) run();' });

      expect(actualResult).toEqual(expectedResult);
    });

    it('should not treat generics as a tag', () => {
      const expectedResult =
        '[keyword2|const] [title variable_|ref] = useRef<HTMLDivElement | [literal|null]>[parenthesis|(][literal|null][parenthesis|)];';
      const actualResult = highlight({ code: 'const ref = useRef<HTMLDivElement | null>(null);' });

      expect(actualResult).toEqual(expectedResult);
    });
  });

  describe('declarations', () => {
    it('should color a non-function const as a variable', () => {
      const expectedResult = '[keyword2|const] [title variable_|total] = [number|5];';
      const actualResult = highlight({ code: 'const total = 5;' });

      expect(actualResult).toEqual(expectedResult);
    });

    it('should color an arrow function const as a function', () => {
      const expectedResult =
        '[keyword2|const] [title function_|add] = [parenthesis|(]a, b[parenthesis|)] [arrow|=>] a + b;';
      const actualResult = highlight({ code: 'const add = (a, b) => a + b;' });

      expect(actualResult).toEqual(expectedResult);
    });

    it('should color a typed arrow function const as a function', () => {
      const expectedResult =
        '[keyword2|const] [title function_|Comp]: FC = [parenthesis|(][parenthesis|)] [arrow|=>] [literal|null];';
      const actualResult = highlight({ code: 'const Comp: FC = () => null;' });

      expect(actualResult).toEqual(expectedResult);
    });

    it('should not run past the declared name in a for...of loop', () => {
      const expectedResult =
        '[keyword|for] [parenthesis|(][keyword2|const] [title variable_|item] [keyword2|of] items[parenthesis|)] [title function_ call__|log][parenthesis|(]item[parenthesis|)];';
      const actualResult = highlight({ code: 'for (const item of items) log(item);' });

      expect(actualResult).toEqual(expectedResult);
    });

    it('should not run into the next line when there are no semicolons', () => {
      const expectedResult = '[keyword2|let] [title variable_|count]\ncount = [number|1]';
      const actualResult = highlight({ code: 'let count\ncount = 1' });

      expect(actualResult).toEqual(expectedResult);
    });

    it('should color every destructured name, including the ones after a default value', () => {
      const expectedResult =
        '[keyword2|const] [curly-brace|{] [title variable_|a] = [number|5], [attr|b]: [title variable_|renamed], [title variable_|c] [curly-brace|}] = props;';
      const actualResult = highlight({ code: 'const { a = 5, b: renamed, c } = props;' });

      expect(actualResult).toEqual(expectedResult);
    });

    it('should color a var declaration without a debug scope', () => {
      const expectedResult = '[keyword2|var] [curly-brace|{] [var-variable-name|a] [curly-brace|}] = b;';
      const actualResult = highlight({ code: 'var { a } = b;' });

      expect(actualResult).toEqual(expectedResult);
    });
  });

  describe('TypeScript keywords', () => {
    it('should not leak TypeScript keywords into JavaScript', () => {
      const expectedResult = 'type = [number|1]; interface = [number|2];';
      const actualResult = highlight({ code: 'type = 1; interface = 2;', language: 'javascript' });

      expect(actualResult).toEqual(expectedResult);
    });

    it('should highlight primitive types in a type position', () => {
      const expectedResult =
        '[keyword2|function] [title function_|f][parenthesis|(][attr|a]: [built_in|string], [attr|b]?: [built_in|number][parenthesis|)]: [built_in|unknown] [curly-brace|{][curly-brace|}]';
      const actualResult = highlight({ code: 'function f(a: string, b?: number): unknown {}' });

      expect(actualResult).toEqual(expectedResult);
    });

    it('should not highlight a variable named like a primitive type', () => {
      const expectedResult = '[keyword|return] number * [number|2];';
      const actualResult = highlight({ code: 'return number * 2;' });

      expect(actualResult).toEqual(expectedResult);
    });

    it('should highlight an interface header and keep its "{" colored', () => {
      const expectedResult =
        '[keyword2|interface] [title class_|Props] [keyword2|extends] [title class_ inherited__|Base] [curly-brace|{][curly-brace|}]';
      const actualResult = highlight({ code: 'interface Props extends Base {}' });

      expect(actualResult).toEqual(expectedResult);
    });

    it('should highlight the inherited class of a generic class', () => {
      const expectedResult =
        '[keyword2|class] [title class_|Foo]<T> [keyword2|extends] [title class_ inherited__|Base]<T> [curly-brace|{][curly-brace|}]';
      const actualResult = highlight({ code: 'class Foo<T> extends Base<T> {}' });

      expect(actualResult).toEqual(expectedResult);
    });

    it('should not highlight "class" inside an identifier', () => {
      const expectedResult = '[keyword|return] subclass [keyword|instanceof] Base;';
      const actualResult = highlight({ code: 'return subclass instanceof Base;' });

      expect(actualResult).toEqual(expectedResult);
    });

    it('should not highlight a variable named "namespace" as a namespace declaration', () => {
      const expectedResult = '[keyword2|const] [title variable_|x] = [keyword2|namespace] [keyword|as] Foo;';
      const actualResult = highlight({ code: 'const x = namespace as Foo;' });

      expect(actualResult).toEqual(expectedResult);
    });
  });

  describe('template literals', () => {
    // biome-ignore lint: aaa
    it('should highlight the expression inside ${} and allow nested braces', () => {
      const expectedResult =
        // biome-ignore lint: aaa
        '[keyword2|const] [title variable_|s] = [string|`a [subst|${[title function_ call__|fn][parenthesis|(][curly-brace|{] [attr|a]: [number|1] [curly-brace|}][parenthesis|)]}] b`];';
      // biome-ignore lint: aaa
      const actualResult = highlight({ code: 'const s = `a ${fn({ a: 1 })} b`;' });

      expect(actualResult).toEqual(expectedResult);
    });
  });

  describe('regex literals', () => {
    it('should highlight a regex containing a quote without opening a string', () => {
      const expectedResult =
        "[keyword2|const] [title variable_|re] = [regexp|/'/g]; [keyword2|const] [title variable_|after] = [number|1];";
      const actualResult = highlight({ code: "const re = /'/g; const after = 1;" });

      expect(actualResult).toEqual(expectedResult);
    });

    it('should not treat division as a regex', () => {
      const expectedResult = '[keyword2|const] [title variable_|ratio] = a / b / [number|2];';
      const actualResult = highlight({ code: 'const ratio = a / b / 2;' });

      expect(actualResult).toEqual(expectedResult);
    });
  });

  describe('attr & function calls', () => {
    it('should not highlight a ternary branch or a case label as an attr', () => {
      const expectedResult =
        '[keyword2|const] [title variable_|v] = cond ? a: b; [keyword|switch] [parenthesis|(]x[parenthesis|)] [curly-brace|{] [keyword|case] FOO: [keyword|break]; [curly-brace|}]';
      const actualResult = highlight({ code: 'const v = cond ? a: b; switch (x) { case FOO: break; }' });

      expect(actualResult).toEqual(expectedResult);
    });

    it('should highlight an optional property as an attr', () => {
      const expectedResult = '[keyword2|type] P = [curly-brace|{] [attr|age]?: [built_in|number] [curly-brace|}];';
      const actualResult = highlight({ code: 'type P = { age?: number };' });

      expect(actualResult).toEqual(expectedResult);
    });

    it('should highlight function names that end with a keyword, and methods named like a keyword', () => {
      const expectedResult =
        '[title function_ call__|motif][parenthesis|(][parenthesis|)]; cache.[title function_ call__|delete][parenthesis|(]key[parenthesis|)];';
      const actualResult = highlight({ code: 'motif(); cache.delete(key);' });

      expect(actualResult).toEqual(expectedResult);
    });

    it('should not highlight typeof as a function call', () => {
      const expectedResult = '[keyword2|typeof] [parenthesis|(]x[parenthesis|)];';
      const actualResult = highlight({ code: 'typeof (x);' });

      expect(actualResult).toEqual(expectedResult);
    });
  });
});
