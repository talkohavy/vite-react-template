import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

const FormKeys = {
  name: 'name',
  age: 'age',
} as const;

export default function UseFormStatusTab() {
  const [res, submitAction] = useActionState(async (_previousState: any, formData: any) => {
    const response = await updateUserInServer(formData);

    console.log('_previousState is:', _previousState);
    console.log(FormKeys.name, 'is: ', formData.get(FormKeys.name));
    console.log(FormKeys.age, 'is: ', formData.get(FormKeys.age));

    return response;
  }, null);

  const { error, data } = res ?? { error: null, data: null };

  return (
    <div className='flex flex-col gap-4 p-4'>
      <h2 className='text-xl font-bold'>Chapter 2: useFormStatus</h2>

      <p>
        In design systems, it's common to write design components that need access to information about the form they're
        in, without drilling props down to the component. This can be done via Context, but to make the common case
        easier, we've added a new hook useFormStatus:
      </p>

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

        <DesignButton />

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

function DesignButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type='submit'
      disabled={pending}
      className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50'
    >
      Update
    </button>
  );
}
