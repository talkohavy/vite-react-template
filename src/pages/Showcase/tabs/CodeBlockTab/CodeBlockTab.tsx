import CodeBlock from '@src/components/CodeBlock';

export default function CodeBlockTab() {
  return (
    <>
      <div className='flex flex-col justify-start gap-2 w-full'>
        <div>Vanilla Typescript:</div>

        <div>
          <CodeBlock language='typescript' code={TYPESCRIPT_SAMPLE} />
        </div>
      </div>

      <div className='flex flex-col justify-start gap-2 w-full'>
        <div>React Typescript:</div>

        <div>
          <CodeBlock language='typescript' code={REACT_TYPESCRIPT_SAMPLE} />
        </div>
      </div>

      <div className='w-96 h-10'>
        <CodeBlock code={'ls --name hello'} />
      </div>

      <div className='flex flex-col justify-start gap-6 w-full'>
        <div className='text-xl font-bold'>Highlighting edge cases (all used to be broken):</div>

        {HIGHLIGHTING_EDGE_CASE_SAMPLES.map(({ title, whatToLookFor, language, code }) => (
          <div key={title} className='flex flex-col justify-start gap-2 w-full'>
            <div className='font-bold'>{title}</div>
            <div className='text-sm opacity-70'>{whatToLookFor}</div>

            <div>
              <CodeBlock language={language} code={code} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

type HighlightingEdgeCaseSample = {
  title: string;
  whatToLookFor: string;
  language: 'typescript' | 'javascript';
  code: string;
};

const HIGHLIGHTING_EDGE_CASE_SAMPLES: Array<HighlightingEdgeCaseSample> = [
  {
    title: '1. JSX inside JSX expressions',
    whatToLookFor:
      'Loader is a tag, the items.map(...) child has JS colors, and the ">" of "=>" inside onClick does not close the button tag.',
    language: 'typescript',
    code: `return (
  <Suspense fallback={<Loader />}>
    <ul>{items.map((item) => <Item key={item.id} />)}</ul>
    <button onClick={() => setOpen(count > 1)}>Open</button>
  </Suspense>
);`,
  },
  {
    title: '2. const/let variables vs. functions',
    whatToLookFor: 'total, name and isOpen are variable-colored. Only add and load are function-colored.',
    language: 'typescript',
    code: `const total = 5;
const name = 'Tal';
let isOpen = false;
const add = (a, b) => a + b;
const load = async () => {};`,
  },
  {
    title: '3a. A bare "<" comparison',
    whatToLookFor: '"i<n" is a comparison, not a JSX tag, so the rest of the snippet keeps its highlighting.',
    language: 'typescript',
    code: `for (let i=0;i<n;i++) { sum(i); }
const afterLoop = 1;`,
  },
  {
    title: '3b. A "<" ... ">" comparison',
    whatToLookFor: '"a<b && c>d" is a plain comparison, not a tag.',
    language: 'typescript',
    code: `if (a<b && c>d) { run(); }
const afterIf = 2;`,
  },
  {
    title: '4. Where a declared name ends',
    whatToLookFor:
      'Only the declared names (item, count, age, names, a, b) are variable-colored. number and string are type-colored.',
    language: 'typescript',
    code: `for (const item of items) { log(item); }

let count
count = getCount()

const age: number = 5;
let names: readonly string[];

const { a = 5, b } = props;`,
  },
  {
    title: '5. TS-only keywords in JavaScript',
    whatToLookFor: 'This block is JavaScript, so type, private, interface and enum are plain identifiers.',
    language: 'javascript',
    code: `const config = {};
config.type = 1;
type = 'plain JS variable';
private = true;
interface = 'also a valid JS identifier';
enum = 3;`,
  },
  {
    title: '6. Regex literals',
    whatToLookFor: `The regexes are regex-colored, and the "'" inside the first one does not open a string.`,
    language: 'typescript',
    code: `const quote = /'/; const notAString = 1;
const tag = /<div>/g;
const after = 2;`,
  },
  {
    title: '7. Template literal ${} substitutions',
    whatToLookFor:
      'The substitution runs until its matching "}", and the call, number and string inside it are colored.',
    language: 'typescript',
    code: `const s = \`a \${fn({ a: 1 })} b\`;
const t = \`total: \${sum(1, 2)} \${'x'}\`;`,
  },
  {
    title: '8. TS primitive types',
    whatToLookFor: 'string, number, boolean, unknown, any and never are type-colored.',
    language: 'typescript',
    code: `function f(a: string, b: number, c: boolean): unknown {
  let x: any;
  let y: never;
}`,
  },
  {
    title: '9. Interfaces',
    whatToLookFor:
      'Both braces are colored, "interface"/"extends" match "type"/"class", and Props and Base are class-colored.',
    language: 'typescript',
    code: `interface Props extends Base {
  name: string;
}

type Id = string;`,
  },
  {
    title: '10. extends with generics',
    whatToLookFor:
      'B and Base both get the inherited-class color. Still open: Bar (after "implements") is not class-colored.',
    language: 'typescript',
    code: `class A extends B {}
class Foo<T> extends Base<T> implements Bar {}`,
  },
  {
    title: '11. Word boundaries',
    whatToLookFor: '"subclass" is a plain identifier, and "as" in "namespace as Foo" is a keyword.',
    language: 'typescript',
    code: `return subclass instanceof Base;
const x = namespace as Foo;`,
  },
  {
    title: '12. Identifiers followed by ":"',
    whatToLookFor: 'Only the object keys "name" and "age?" get attr color, not the ternary "a" or "case FOO".',
    language: 'typescript',
    code: `const v = cond ? a: b;
switch (x) { case FOO: break; }
const o = { name: 'x' };
type P = { age?: number };`,
  },
  {
    title: '13. Function calls',
    whatToLookFor:
      'motif() and reimport() are calls and typeof is a keyword. Still open: Foo(), $(), _helper() and useState<string>() are not colored as calls.',
    language: 'typescript',
    code: `motif(); reimport(); format();
typeof(x);
Foo(); $('#id'); _helper();
useState<string>('a');`,
  },
  {
    title: '14. Leftovers',
    whatToLookFor:
      '"var { c } =" no longer has the debug "oops-you-made-a-mistake-1" scope. Still open: get/set are not keywords, and in "let a = 1, b = 2" only "a" is colored.',
    language: 'typescript',
    code: `class A {
  get value() { return 1; }
  set value(v) {}
}

let a = 1, b = 2;
var { c } = d;`,
  },
];

const TYPESCRIPT_SAMPLE = `'use strict'

import { useMemo, useEffect } from 'react';
import { convertReactPropsToRevealProps } from '../utils/convertReactPropsToRevealProps';

const UPPER_CASE_CONST = 300;

/**
 * this is a JSDOC (shocking...)
 */

async function killMe2(arr: Array<any>) {
    return void arr.pop();
}

class Person {
    constructor(name){
        super('kill me')
        this.name = name;
    }
}`;

const REACT_TYPESCRIPT_SAMPLE = `export default function UseTab() {
  const promise = fetchComments();

  return (
    <div className='flex flex-col gap-4 p-4'>
      <Suspense fallback={<Loader />}>
        <CommentsSection commentsPromise={promise} />
      </Suspense>
    </div>
  );
}

function Loader(){
  return <div>Loading...</div>;
}
`;
