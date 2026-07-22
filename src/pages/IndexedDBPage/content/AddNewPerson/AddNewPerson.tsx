import { useState } from 'react';
import { usersTableName } from '@src/common/constants';
import Button from '@src/components/controls/Button';
import Input from '@src/components/controls/Input';
import NumberInput from '@src/components/controls/NumberInput';
import { indexedDBClient } from '@src/lib/IndexedDB';
import { validatePerson } from '../../logic/personValidationSchema';
import type { Person } from '../../types';

type AddNewPersonProps = {
  setRecords: (value?: any) => void;
};

export default function AddNewPerson(props: AddNewPersonProps) {
  const { setRecords } = props;

  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<number>(0);
  const [id, setId] = useState<number>(1);
  const [error, setError] = useState('');

  const handleAddPerson = async () => {
    try {
      setError('');

      const personId = Number(id);
      const personAge = Number(age);

      const person = { id: personId, name, age: personAge };
      validatePerson(person);

      try {
        await indexedDBClient.addRecord({
          tableName: usersTableName,
          data: person,
        });
      } catch (error) {
        console.error('Failed to add person record:', error);
        throw new Error(`Failed to add person record: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      setName('');
      setAge(0);
      setId(1);

      const result = await indexedDBClient.getAll<Person>({
        tableName: usersTableName,
      });

      setRecords(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };

  return (
    <div className='mb-6 p-4 border rounded-md dark:border-gray-700 dark:bg-gray-800'>
      <h2 className='text-lg font-semibold mb-4 dark:text-gray-200'>Add New Person</h2>

      <div className='flex flex-col gap-4'>
        <div className='w-44'>
          <div className='block mb-1 dark:text-gray-300'>ID (positive number)</div>
          <NumberInput value={id} setValue={setId} step={1} placeholder='Enter ID' min={0} />
        </div>

        <div className='w-44'>
          <div className='block mb-1 dark:text-gray-300'>Name</div>
          <Input initialValue={name} onChange={setName} placeholder='Enter name' />
        </div>

        <div className='w-44'>
          <div className='block mb-1 dark:text-gray-300'>Age</div>
          <NumberInput value={age} setValue={setAge} step={1} placeholder='Enter age' min={0} max={120} />
        </div>

        {error && <div className='p-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded'>{error}</div>}

        <Button onClick={handleAddPerson} className='mr-6 w-44'>
          Add Person
        </Button>
      </div>
    </div>
  );
}
