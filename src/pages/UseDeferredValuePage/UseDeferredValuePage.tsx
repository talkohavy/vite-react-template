import { useState, useMemo, useDeferredValue } from 'react';
import Input from '../../components/controls/Input';

export default function UseDeferredValuePage() {
  const [input, setInput] = useState('');

  const deferredInput = useDeferredValue(input); // <--- optional second argument of defaultValue.

  console.log('---------------------------');
  console.log('input', input);
  console.log('deferredInput', deferredInput);

  return (
    <div className='flex size-full flex-col gap-8 overflow-auto p-6'>
      {/* We consider the input of "high" priority, it should display fast */}
      <Input onChange={setInput} />

      <p>List will appear here:</p>

      {/*
      We consider the List to be of "low" priority, it's fine that it's delayed.
      The important part is to not block the main thread, and delay the rendering of the input element.

      The useDeferredValue hook accepts a value and returns a deferred value.
      The deferred value is a value that is not immediately updated, but is updated after a short delay.
      If you were to console log the input & the deferred input, you would see that as opposed to the input,
      the deferred input is not updated for every keystroke.
       */}
      <List input={deferredInput} />
    </div>
  );
}

function List({ input }: { input: string }) {
  const LIST_SIZE = 30000;

  const list = useMemo(() => {
    if (!input) return [];

    return Array.from({ length: LIST_SIZE }, (_, index) => <div key={index}>{input}</div>);
  }, [input]);

  return <div className='flex flex-col gap-2'>{list}</div>;
}
