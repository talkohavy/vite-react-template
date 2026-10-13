import { useActionState, useOptimistic } from 'react';
import clsx from 'clsx';

const FormKeys = {
  name: 'name',
  age: 'age',
} as const;

export default function UseOptimisticUpdateTab() {
  const [res, submitAction, isPending] = useActionState(async (_previousState: any, formData: any) => {
    try {
      const response = await updateUserInServer(formData);

      if (response.error) return _previousState;

      return response;
    } catch {
      return _previousState;
    }
  }, null);

  const { data } = res ?? { error: null, data: null };

  const [optimisticUser, setOptimisticUser] = useOptimistic<User, User>(
    data,
    (_currentUser: User, optimisticUser: User) => optimisticUser,
  );

  const handleSubmit = async (formData: FormData) => {
    const user = createUserPayload(formData);

    // Show the new name right away, before the server confirms it
    setOptimisticUser(user);

    submitAction(formData);
  };

  return (
    <div className='flex flex-col gap-4 p-4'>
      <h2 className='text-xl font-bold'>Chapter 3: useOptimistic</h2>

      <h3 className='text-xl font-bold'>Usage Example:</h3>

      <form action={handleSubmit} className='flex flex-col gap-2'>
        <label className='flex flex-col gap-1'>
          <span>Change Name:</span>

          <input
            type='text'
            name={FormKeys.name}
            placeholder='Enter your name'
            disabled={isPending}
            className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </label>

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
      </form>

      <p>
        User is:
        <pre className={clsx('text-lg font-semibold', isPending && 'text-blue-500')}>
          {JSON.stringify(optimisticUser, null, 2)}
        </pre>
      </p>
    </div>
  );
}

function createUserPayload(formData: FormData) {
  const newName = String(formData.get(FormKeys.name) ?? '');
  const newAge = Number(formData.get(FormKeys.age) ?? 0);

  const user: User = {
    name: newName,
    age: newAge,
  };

  return user;
}

function updateUserInServer(formData: FormData): Promise<ServerResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data: User = {
        name: formData.get(FormKeys.name) as string,
        age: Number(formData.get(FormKeys.age) as string),
      };

      if (data.age <= 0) {
        reject({ error: 'Age cannot be negative.', data: null });
        return;
      }

      if (!data.name || data.name.trim() === '') {
        reject({ error: 'Name cannot be empty.', data: null });
        return;
      }

      resolve({ data, error: null });
    }, 500);
  });
}

type User = {
  name: string;
  age: number;
};
type DataResponse = { data: User; error: null };
type ErrorResponse = { error: string | null; data: null };
type ServerResponse = DataResponse | ErrorResponse;
