import clsx from 'clsx';
import { addDataAttributeWhen } from '@src/common/utils/addDataAttributeWhen';
import { DEFAULT_INDENT_SIZE } from '@src/components/TreeView/logic/constants';
import type { TreeNodeContentProps } from '@src/components/TreeView/types';

export default function CustomNodeCssFile(props: TreeNodeContentProps) {
  const { node, level, indentSize = DEFAULT_INDENT_SIZE, isSelected, handleNodeClick } = props;

  return (
    <div
      style={{ marginLeft: level * indentSize }}
      className={clsx(
        'flex items-center p-3 rounded-md border mb-1 transition-all duration-200 cursor-pointer',
        isSelected
          ? 'bg-purple-100 dark:bg-purple-900/40 border-purple-400 dark:border-purple-600'
          : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30',
      )}
      onClick={handleNodeClick}
      data-selected={addDataAttributeWhen(isSelected)}
    >
      <span className='text-purple-600 dark:text-purple-400 mr-3 text-xl'>🎨</span>

      <div className='flex-1'>
        <span className='font-semibold text-purple-800 dark:text-purple-300'>{node.name}</span>

        {node.metadata && (
          <div className='flex items-center gap-2 mt-1'>
            <span className='text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-800/50 px-2 py-1 rounded'>
              Stylesheet
            </span>

            <span className='text-xs text-gray-500 dark:text-gray-400'>{node.metadata.size ?? 'unknown'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
