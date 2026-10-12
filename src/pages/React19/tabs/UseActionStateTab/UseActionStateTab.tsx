import { useActionState } from 'react';
import CodeBlock from '@src/components/CodeBlock';
import LineOfCode from '@src/components/LineOfCode';

const FormKeys = {
  name: 'name',
  age: 'age',
} as const;

const USE_ACTION_STATE_EXAMPLE = `const [state, submitAction, isPending] = useActionState(
  async (previousState: ServerResponse | null, formData: FormData) => {
    const response = await updateUserInServer(formData);
    return response;
  },
  null // <--- initial state
);

// Pass the returned action to a form; React calls it on submit
<form action={submitAction}>
  <button type='submit' disabled={isPending}>
    Update
  </button>
</form>`;

export default function UseActionStateTab() {
  const [res, submitAction, isPending] = useActionState(async (_previousState: any, formData: any) => {
    const response = await updateUserInServer(formData);

    console.log('_previousState is:', _previousState);
    console.log(FormKeys.name, 'is: ', formData.get(FormKeys.name));
    console.log(FormKeys.age, 'is: ', formData.get(FormKeys.age));

    return response;
  }, null);

  const { error, data } = res ?? { error: null, data: null };

  return (
    <div className='flex flex-col gap-4 p-4'>
      <h2 className='text-xl font-bold'>Chapter 1: useActionState</h2>

      <p>
        <LineOfCode text='useActionState' /> is a hook for managing state during form submissions. It accepts an action
        function — which receives the previous state and the submitted formData, and returns the new state (it may be
        async) — along with an initial state that the previous state starts as. It returns the action's latest state, a
        submitAction to wire to a form's action prop, and an isPending flag so the UI can disable inputs or show
        feedback while the action is running.
      </p>

      <h3 className='text-xl font-bold'>Code Example:</h3>

      <CodeBlock language='tsx' code={USE_ACTION_STATE_EXAMPLE} />

      <h3 className='text-xl font-bold'>Usage Example:</h3>

      <form action={submitAction} className='flex flex-col gap-2'>
        <input
          type='text'
          placeholder='Enter your name'
          name={FormKeys.name}
          className='flex gap-2 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />

        <input
          type='number'
          placeholder='Enter your age'
          name={FormKeys.age}
          className='flex gap-2 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />

        <button
          type='submit'
          disabled={isPending}
          className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50'
        >
          Update
        </button>

        {data && <p className='text-green-500'>data: {JSON.stringify(data, null, 2)}</p>}

        {error && <p className='text-red-500'>{error}</p>}
      </form>
    </div>
  );
}

function updateUserInServer(formData: FormData): Promise<ServerResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = {
        name: formData.get(FormKeys.name) as string,
        age: formData.get(FormKeys.age) as string,
      };

      if (!data.name || data.name.trim() === '') {
        resolve({ error: 'Name cannot be empty.', data: null });
      } else {
        resolve({ data, error: null }); // null means success
      }
    }, 500);
  });
}

type DataResponse = { data: any; error: null };
type ErrorResponse = { error: string | null; data: null };
type ServerResponse = DataResponse | ErrorResponse;
