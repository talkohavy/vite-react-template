import clsx from 'clsx';
import { addDataAttributeWhen } from '@src/common/utils/addDataAttributeWhen';
import { DEFAULT_INDENT_SIZE } from '@src/components/TreeView/logic/constants';
import type { TreeNodeContentProps } from '@src/components/TreeView/types';

export default function CustomNodeFolder(props: TreeNodeContentProps) {
  const {
    node,
    level,
    indentSize = DEFAULT_INDENT_SIZE,
    isExpanded,
    isLoading,
    isSelected,
    handleNodeClick,
    handleExpandToggle,
  } = props;

  return (
    <div
      style={{ marginLeft: level * indentSize }}
      className={clsx(
        'flex items-center p-3 rounded-md border mb-1 transition-all duration-200 cursor-pointer',
        isSelected
          ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 dark:border-emerald-600'
          : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30',
      )}
      onClick={handleNodeClick}
      data-selected={addDataAttributeWhen(isSelected)}
    >
      {/* Expand/Collapse Button */}
      <button
        type='button'
        onClick={(e) => {
          e.stopPropagation();
          handleExpandToggle();
        }}
        disabled={isLoading}
        className={clsx(
          'mr-2 w-5 h-5 flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition-transform duration-200',
          isExpanded && 'rotate-90',
          isLoading && 'opacity-50 cursor-wait',
        )}
      >
        {isLoading ? (
          <svg className='animate-spin h-4 w-4' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            />
          </svg>
        ) : (
          <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' viewBox='0 0 20 20' fill='currentColor'>
            <path
              fillRule='evenodd'
              d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
              clipRule='evenodd'
            />
          </svg>
        )}
      </button>

      {/* Folder Icon */}
      <span className='text-emerald-600 dark:text-emerald-400 mr-3 text-xl'>{isExpanded ? '📂' : '📁'}</span>

      {/* Folder Info */}
      <div className='flex-1'>
        <span className='font-bold text-emerald-800 dark:text-emerald-300'>{node.name}</span>

        {node.metadata && (
          <div className='flex items-center gap-2 mt-1'>
            <span className='text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-800/50 px-2 py-1 rounded'>
              {node.metadata.department}
            </span>

            {node.metadata.count !== undefined && (
              <span className='text-xs text-gray-500 dark:text-gray-400'>{node.metadata.count} items</span>
            )}
          </div>
        )}
      </div>

      {/* Loading Indicator */}
      {isLoading && <span className='text-xs text-emerald-600 dark:text-emerald-400 ml-2'>Loading...</span>}
    </div>
  );
}
