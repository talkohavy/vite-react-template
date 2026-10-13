import type { TreeNode } from '../../../../../../components/TreeView';

type SelectedNodeInfoProps = {
  selectedNode: TreeNode | null;
};

export default function SelectedNodeInfo(props: SelectedNodeInfoProps) {
  const { selectedNode } = props;

  const Icon = selectedNode?.icon;

  return (
    <div className='bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>Selected Node Info</h3>

      {selectedNode ? (
        <div className='space-y-3'>
          <div>
            <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>Name:</span>
            <p className='text-gray-900 dark:text-gray-100'>{selectedNode.name}</p>
          </div>

          <div>
            <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>Type:</span>
            <p className='text-gray-900 dark:text-gray-100 capitalize'>{selectedNode.type}</p>
          </div>

          <div>
            <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>ID:</span>
            <p className='text-gray-900 dark:text-gray-100 font-mono text-sm'>{selectedNode.id}</p>
          </div>

          {Icon && (
            <div>
              <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>Icon:</span>
              <p className='text-gray-900 dark:text-gray-100'>
                <Icon />
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className='text-gray-500 dark:text-gray-400'>Click on a node to see its details</p>
      )}
    </div>
  );
}
