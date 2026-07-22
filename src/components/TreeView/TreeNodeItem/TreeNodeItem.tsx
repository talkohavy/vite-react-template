import { memo } from 'react';
import { addDataAttributeWhen } from '@src/common/utils/addDataAttributeWhen';
import { DEFAULT_INDENT_SIZE, TREE_VIEW_NODE_CLASS, TREE_VIEW_NODE_ITEMS_LIST_CLASS } from '../logic/constants';
import DefaultTreeNodeContent from './content/DefaultTreeNodeContent';
import { useTreeNodeItemLogic } from './logic/useTreeNodeItemLogic';
import type { TreeNodeItemProps } from '../types';

const TreeNodeItem = memo((props: TreeNodeItemProps) => {
  const {
    level,
    selectedNodeId,
    handleSelectNodeId,
    indentSize = DEFAULT_INDENT_SIZE,
    showIcons = false,
    shouldExpandOnClick = false,
    onNodeClick,
    onNodeExpand,
    updateNode,
    expandNode,
    collapseNode,
    renderNode: CustomTreeNodeContent,
    testId = '',
  } = props;

  const { items, isFolderType, isLoading, isExpanded, isSelected, iconToShow, handleNodeClick, handleExpandToggle } =
    useTreeNodeItemLogic(props);

  return (
    <div className={TREE_VIEW_NODE_CLASS} data-test-id={testId} data-is-expanded={addDataAttributeWhen(isExpanded)}>
      {CustomTreeNodeContent ? (
        <CustomTreeNodeContent
          {...props}
          isFolderType={isFolderType}
          isLoading={isLoading}
          isExpanded={isExpanded}
          isSelected={isSelected}
          iconToShow={iconToShow}
          handleNodeClick={handleNodeClick}
          handleExpandToggle={handleExpandToggle}
          testId={testId}
          renderNode={DefaultTreeNodeContent}
        />
      ) : (
        <DefaultTreeNodeContent
          {...props}
          isFolderType={isFolderType}
          isLoading={isLoading}
          isExpanded={isExpanded}
          isSelected={isSelected}
          iconToShow={iconToShow}
          handleNodeClick={handleNodeClick}
          handleExpandToggle={handleExpandToggle}
          testId={testId}
        />
      )}

      {isExpanded && !!items?.length && (
        <div className={TREE_VIEW_NODE_ITEMS_LIST_CLASS}>
          {items.map((child, index) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              selectedNodeId={selectedNodeId}
              handleSelectNodeId={handleSelectNodeId}
              indentSize={indentSize}
              showIcons={showIcons}
              shouldExpandOnClick={shouldExpandOnClick}
              onNodeClick={onNodeClick}
              onNodeExpand={onNodeExpand}
              updateNode={updateNode}
              expandNode={expandNode}
              collapseNode={collapseNode}
              renderNode={CustomTreeNodeContent}
              testId={`${testId}-i${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

TreeNodeItem.displayName = 'TreeNodeItem';

export default TreeNodeItem;
