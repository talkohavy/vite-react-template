import clsx from 'clsx';
import { addDataAttributeWhen } from '@src/common/utils/addDataAttributeWhen';
import { DEFAULT_INDENT_SIZE } from '@src/components/TreeView/logic/constants';
import type { TreeNodeContentProps } from '@src/components/TreeView/types';

export default function CustomNodeJavascriptFile(props: TreeNodeContentProps) {
  const { node, level, indentSize = DEFAULT_INDENT_SIZE, isSelected, handleNodeClick } = props;

  return (
    <div
      style={{ marginLeft: level * indentSize }}
      className={clsx(
        'flex items-center p-3 rounded-md border mb-1 transition-all duration-200 cursor-pointer',
        isSelected
          ? 'bg-yellow-100 dark:bg-yellow-900/40 border-yellow-400 dark:border-yellow-600'
          : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/30',
      )}
      onClick={handleNodeClick}
      data-selected={addDataAttributeWhen(isSelected)}
    >
      <span className='text-yellow-600 dark:text-yellow-400 mr-3 text-xl'>🟢</span>

      <div className='flex-1'>
        <span className='font-semibold text-yellow-800 dark:text-yellow-300'>{node.name}</span>

        {node.metadata && (
          <div className='flex items-center gap-2 mt-1'>
            <span className='text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-800/50 px-2 py-1 rounded'>
              JavaScript
            </span>

            <span className='text-xs text-gray-500 dark:text-gray-400'>{node.metadata.size}</span>
          </div>
        )}
      </div>
    </div>
  );
}
