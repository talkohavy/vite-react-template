import { DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON, NodeTypes } from '../../logic/constants';
import type { TreeNodeItemProps } from '../../types';

export function useTreeNodeItemLogic(props: TreeNodeItemProps) {
  // Calls no hooks, so the compiler won't infer it as one without this directive.
  'use memo';

  const {
    node,
    onNodeClick,
    shouldExpandOnClick,
    showIcons,
    selectedNodeId,
    handleSelectNodeId,
    expandNode,
    collapseNode,
  } = props;

  const isSelected = node.id === selectedNodeId;

  const isFolderType = node.type === NodeTypes.Folder;

  const handleExpandToggle = async () => {
    if (node.isExpanded) {
      collapseNode(node.id);
    } else {
      await expandNode(node.id);
    }
  };

  const handleNodeClick = () => {
    if (isFolderType && shouldExpandOnClick) handleExpandToggle();

    if (selectedNodeId !== node.id) handleSelectNodeId(node.id);

    onNodeClick?.(node);
  };

  const defaultIcon = node.type === NodeTypes.Folder ? DEFAULT_FOLDER_ICON : DEFAULT_FILE_ICON;
  const iconToShow = showIcons ? node.icon || defaultIcon : null;

  return {
    items: node.items,
    isExpanded: !!node.isExpanded,
    isFolderType,
    isLoading: !!node.isLoading,
    isSelected,
    handleNodeClick,
    handleExpandToggle,
    iconToShow,
  };
}
