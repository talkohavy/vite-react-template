import { useState } from 'react';
import { usersTableName } from '@src/common/constants';
import Button from '@src/components/controls/Button';
import Input from '@src/components/controls/Input';
import { indexedDBClient } from '@src/lib/IndexedDB';
import type { Person } from '../../types';

export default function GetOnePerson() {
  const [name, setName] = useState<string>('');
  const [records, setRecords] = useState<Person[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!name.trim()) {
      setError('Please enter a name to search');
      return;
    }

    try {
      setError('');
      setIsLoading(true);

      if (!name || name.trim() === '') throw new Error('Name is required for search');

      try {
        const result = await indexedDBClient.getRecordsByIndex<Person>({
          tableName: usersTableName,
          indexName: 'nameIndex',
          value: name,
        });

        setRecords(result);

        if (result.length === 0) setError(`No records found with name "${name}"`);
      } catch (error) {
        console.error(`Failed to retrieve person with name ${name}:`, error);
        setError(`Failed to retrieve person with name ${name}:`);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='mb-6 p-4 border rounded-md dark:border-gray-700 dark:bg-gray-800'>
      <h2 className='text-lg font-semibold mb-4 dark:text-gray-200'>Get Person by Name</h2>

      <div className='flex flex-col gap-4'>
        <div className='w-44'>
          <div className='block mb-1 dark:text-gray-300'>Name</div>
          <Input initialValue={name} onChange={setName} placeholder='Enter name to search' />
        </div>

        {error && <div className='p-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded'>{error}</div>}

        <Button onClick={handleSearch} className='mr-6 w-44' disabled={isLoading}>
          Search by Name
        </Button>

        {records.length > 0 && (
          <div className='mt-4'>
            <h3 className='text-md font-semibold mb-2 dark:text-gray-300'>Found Records ({records.length})</h3>
            <div className='border rounded-md divide-y dark:divide-gray-700 dark:border-gray-700'>
              {records.map((record) => (
                <div
                  key={record.id}
                  className='p-4 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900 dark:text-gray-200'
                >
                  <pre className='whitespace-pre-wrap break-words overflow-x-auto'>
                    {JSON.stringify(record, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
