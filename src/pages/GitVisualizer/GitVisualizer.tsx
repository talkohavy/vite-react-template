import { useEffect, useRef, useState } from 'react';
import Select, { type SelectOption } from '@src/components/controls/Select';
import BranchOrderControls from './content/BranchOrderControls';
import GitGraph from './content/GitGraph';
import { EXAMPLES, type Example } from './examples/examples';
import { orderBranches } from './logic/laneOrder';

const options: SelectOption[] = EXAMPLES.map((example) => ({ value: example.id, label: example.label }));

function findExample(id: string) {
  return EXAMPLES.find((example) => example.id === id) ?? EXAMPLES[0];
}

function getAutoOrder(example: Example | undefined) {
  return example ? orderBranches({ model: example.model }) : [];
}

/**
 * Start from the example's manual override if it has one, otherwise from the
 * automatic crossing-minimizing order.
 */
function getInitialOrder(example: Example | undefined) {
  return example?.branchOrder ?? getAutoOrder(example);
}

export default function GitVisualizerPage() {
  const [selectedId, setSelectedId] = useState(EXAMPLES[0]?.id ?? '');
  const [order, setOrder] = useState(() => getInitialOrder(EXAMPLES[0]));
  const [isCustom, setIsCustom] = useState(Boolean(EXAMPLES[0]?.branchOrder));
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedExample = findExample(selectedId);
  const selectedOption: SelectOption = { value: selectedExample?.id ?? '', label: selectedExample?.label ?? '' };
  const colorByBranch: Record<string, string> = Object.fromEntries(
    selectedExample?.model.branches.map((branch) => [branch.name, branch.color]) ?? [],
  );

  // The tree grows upward, so scroll to the bottom (the root commit) whenever
  // the example changes, letting the user read from bottom to top.
  useEffect(() => {
    const container = scrollRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [selectedId]);

  function handleSelect(option: SelectOption) {
    const nextId = option.value.toString();
    const nextExample = findExample(nextId);

    setSelectedId(nextId);
    setOrder(getInitialOrder(nextExample));
    setIsCustom(Boolean(nextExample?.branchOrder));
  }

  function handleMove(props: { index: number; direction: -1 | 1 }) {
    const { index, direction } = props;
    const target = index + direction;

    if (target < 0 || target >= order.length) {
      return;
    }

    const nextOrder = [...order];
    const moved = nextOrder[index];
    const swapped = nextOrder[target];

    if (moved === undefined || swapped === undefined) {
      return;
    }

    nextOrder[index] = swapped;
    nextOrder[target] = moved;
    setOrder(nextOrder);
    setIsCustom(true);
  }

  function handleReset() {
    setOrder(getAutoOrder(selectedExample));
    setIsCustom(false);
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

      <div className='border-b border-gray-200 dark:border-gray-800 px-8 py-4'>
        <BranchOrderControls
          order={order}
          colorByBranch={colorByBranch}
          isCustom={isCustom}
          onMove={handleMove}
          onReset={handleReset}
        />
      </div>

      <div ref={scrollRef} className='flex-1 overflow-auto p-10'>
        <GitGraph model={selectedExample.model} branchOrder={order} />
      </div>
    </div>
  );
}
