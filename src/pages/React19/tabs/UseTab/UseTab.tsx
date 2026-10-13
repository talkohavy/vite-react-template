import { use, Suspense } from 'react';
import CodeBlock from '@src/components/CodeBlock';
import LineOfCode from '@src/components/LineOfCode';

export default function UseTab() {
  const promise = fetchComments();

  // When `use` suspends in Comments, this Suspense boundary will be shown.
  return (
    <div className='flex flex-col gap-4 p-4'>
      <h2 className='text-xl font-bold'>Chapter 4: use</h2>

      <p>
        With <LineOfCode text='use' /> you can read a promise, and React will Suspend until the promise resolves.
      </p>

      <h3 className='text-lg font-bold'>- Code Example:</h3>

      <CodeBlock language='tsx' code={USE_HOOK_EXAMPLE} />

      <h3 className='text-lg font-bold'>- Usage Example:</h3>

      <Suspense fallback={<Loader />}>
        <CommentsSection commentsPromise={promise} />
      </Suspense>
    </div>
  );
}

function Loader() {
  return <div>Loading...</div>;
}

type CommentsProps = {
  commentsPromise: Promise<Comment[]>;
};

function CommentsSection(props: CommentsProps) {
  const { commentsPromise } = props;

  // `use` will suspend until the promise resolves.
  const comments = use(commentsPromise);

  return comments.map((comment) => <SingleComment key={comment.id} comment={comment} />);
}

type SingleCommentProps = {
  comment: Comment;
};

function SingleComment({ comment }: SingleCommentProps) {
  return <p>comment: {comment.text}</p>;
}

function fetchComments(): Promise<Comment[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, text: 'This is a great post!' },
        { id: 2, text: 'I learned a lot from this article.' },
        { id: 3, text: 'Thanks for sharing your knowledge!' },
      ]);
    }, 2000);
  });
}

type Comment = {
  id: number;
  text: string;
};

const USE_HOOK_EXAMPLE = `export default function UseTab() {
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
