import { useState } from 'react';
import { ArrayFilter, type OperatorNames, type FilterScheme } from '@talkohavy/filters';
import clsx from 'clsx';
import Input from '../../components/controls/Input';
import RadioButtons, { type ChildItemProps } from '../../components/controls/RadioButtons';
import { data } from './logic/constants';

const options = [
  { value: 'all', label: 'All' },
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'moderator', label: 'Moderator' },
];

export default function MasterFilterPage() {
  const [value, setValue] = useState('');
  const [role, setRole] = useState(options[0]!.value);

  const filters: FilterScheme<OperatorNames> = [
    {
      fieldName: 'name',
      operator: 'includesCaseInsensitive',
      value: value,
    },
  ];

  if (role !== 'all') {
    filters.push({
      fieldName: 'role',
      operator: 'equals',
      value: role,
    });
  }

  const arrayFilter = new ArrayFilter(filters);

  const results = arrayFilter.applyFilters(data);

  return (
    <div className='size-full flex flex-col gap-6 p-10 overflow-auto'>
      <h1 className='text-2xl font-bold'>Master Filter Page</h1>

      <div>Data length: {data.length}</div>
      <div>Filtered length: {results.length}</div>

      <div>
        <h2 className='font-bold text-xl'>Filters</h2>

        <div>
          <div>
            <div>Search:</div>

            <Input
              initialValue={value}
              onChange={setValue}
              placeholder='Enter search value...'
              className='max-w-[320px]'
            />
          </div>

          <div>
            <div>Role:</div>

            <RadioButtons
              options={options}
              value={role}
              setValue={setRole}
              ChildItem={SingleRadioButton}
              className='flex gap-4'
            />
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        {results.map((item) => (
          <div key={item.id} className='p-4 border rounded shadow'>
            <h2 className='text-xl font-semibold'>{item.name}</h2>

            <p>Age: {item.age}</p>
            <p>Role: {item.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SingleRadioButton(props: ChildItemProps) {
  const { label, isChecked } = props;

  return (
    <div className={clsx('flex justify-center border p-2 rounded-md min-w-20', isChecked && 'bg-blue-500 text-white')}>
      {label}
    </div>
  );
}
