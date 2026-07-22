import { useEffect, useState } from 'react';
import { usersTableName } from '@src/common/constants';
import Button from '@src/components/controls/Button';
import { indexedDBClient } from '@src/lib/IndexedDB';
import type { Person } from '../../types';

type GetAllPersonsProps = {
  records: Array<Person>;
  setRecords: (value?: any) => void;
};

export default function GetAllPersons(props: GetAllPersonsProps) {
  const { records, setRecords } = props;

  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchRecords() {
      try {
        const result = await indexedDBClient.getAll<Person>({
          tableName: usersTableName,
        });

        setRecords(result);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      }
    }

    fetchRecords();
  }, [setRecords]);

  return (
    <>
      <Button
        onClick={async () => {
          try {
            const result = await indexedDBClient.getAll<Person>({
              tableName: usersTableName,
            });

            setRecords(result);
          } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error occurred');
          }
        }}
        className='mr-6 mb-6'
      >
        Get all records from IndexedDB {usersTableName}
      </Button>

      <div className='mt-4'>
        <h2 className='text-lg font-semibold mb-2'>Retrieved Records ({records.length})</h2>

        {error ? (
          <div className='p-4 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded'>{error}</div>
        ) : records.length === 0 ? (
          <div className='p-4 bg-gray-100 dark:bg-gray-800 rounded-md dark:text-gray-200'>
            No records found. Click the button above to fetch records.
          </div>
        ) : (
          <div className='border rounded-md divide-y dark:divide-gray-700 dark:border-gray-700'>
            {records.map((record, index) => (
              <div
                key={record.id ?? index}
                className='p-4 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900 dark:text-gray-200'
              >
                <pre className='whitespace-pre-wrap break-words overflow-x-auto'>{JSON.stringify(record, null, 2)}</pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
