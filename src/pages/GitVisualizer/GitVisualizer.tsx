import { useEffect, useMemo, useRef, useState } from 'react';
import Select, { type SelectOption } from '@src/components/controls/Select';
import GitGraph from './content/GitGraph';
import { EXAMPLES } from './examples/examples';

export default function GitVisualizerPage() {
  const [selectedId, setSelectedId] = useState(EXAMPLES[0]?.id ?? '');
  const scrollRef = useRef<HTMLDivElement>(null);

  const options = useMemo<SelectOption[]>(
    () => EXAMPLES.map((example) => ({ value: example.id, label: example.label })),
    [],
  );

  const selectedExample = useMemo(
    () => EXAMPLES.find((example) => example.id === selectedId) ?? EXAMPLES[0],
    [selectedId],
  );

  const selectedOption = useMemo<SelectOption>(
    () => ({ value: selectedExample?.id ?? '', label: selectedExample?.label ?? '' }),
    [selectedExample],
  );

  // The tree grows upward, so scroll to the bottom (the root commit) whenever
  // the example changes, letting the user read from bottom to top.
  useEffect(() => {
    const container = scrollRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [selectedExample]);

  function handleSelect(option: SelectOption) {
    setSelectedId(option.value.toString());
  }

  if (!selectedExample) {
    return null;
  }

  return (
    <div className='size-full flex flex-col bg-gray-50 dark:bg-gray-950'>
      <header className='flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 px-8 py-5'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-100'>Git Visualizer</h1>
          <p className='text-sm text-gray-500 dark:text-gray-400'>{selectedExample.description}</p>
        </div>
        <div className='flex items-center gap-3'>
          <span className='text-sm font-medium text-gray-600 dark:text-gray-300'>Example</span>
          <Select
            selectedOption={selectedOption}
            setSelectedOption={handleSelect}
            options={options}
            ariaLabel='Choose a git example'
            className='min-w-56'
          />
        </div>
      </header>

      <div ref={scrollRef} className='flex-1 overflow-auto p-10'>
        <GitGraph model={selectedExample.model} branchOrder={selectedExample.branchOrder} />
      </div>
    </div>
  );
}
