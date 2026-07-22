import clsx from 'clsx';
import { addDataAttributeWhen } from '@src/common/utils/addDataAttributeWhen';
import { DEFAULT_INDENT_SIZE } from '@src/components/TreeView/logic/constants';
import type { TreeNodeContentProps } from '@src/components/TreeView/types';

export default function CustomNodeReactFile(props: TreeNodeContentProps) {
  const { node, level, indentSize = DEFAULT_INDENT_SIZE, isSelected, handleNodeClick } = props;

  return (
    <div
      style={{ marginLeft: level * indentSize }}
      className={clsx(
        'flex items-center p-3 rounded-md border mb-1 transition-all duration-200 cursor-pointer',
        isSelected
          ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-400 dark:border-blue-600'
          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30',
      )}
      onClick={handleNodeClick}
      data-selected={addDataAttributeWhen(isSelected)}
    >
      <span className='text-blue-600 dark:text-blue-400 mr-3 text-xl'>⚛️</span>

      <div className='flex-1'>
        <span className='font-semibold text-blue-800 dark:text-blue-300'>{node.name}</span>

        {node.metadata && (
          <div className='flex items-center gap-2 mt-1'>
            <span className='text-xs text-blue-500 dark:text-blue-400 bg-blue-100 dark:bg-blue-800/50 px-2 py-1 rounded'>
              React Component
            </span>

            <span className='text-xs text-gray-500 dark:text-gray-400'>{node.metadata.size ?? 'unknown'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
