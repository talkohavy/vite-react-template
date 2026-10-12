import { use, Suspense } from 'react';

export default function UseTab() {
  const promise = fetchComments();

  // When `use` suspends in Comments, this Suspense boundary will be shown.
  return (
    <div className='flex flex-col gap-4 p-4'>
      <h2 className='text-xl font-bold'>Chapter 4: use</h2>

      <Suspense fallback={<div>Loading...</div>}>
        <CommentsSection commentsPromise={promise} />
      </Suspense>
    </div>
  );
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
