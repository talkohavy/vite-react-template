import { useRef, useState } from 'react';
import CodeBlock from '../../../../components/CodeBlock';
import Button from '../../../../components/controls/Button';
import TreeView, { type TreeNode, type TreeViewRef } from '../../../../components/TreeView';
import { dynamicTreeData } from '../../logic/constants';
import { mockAsyncLoader } from '../../logic/utils/mockAsyncLoader';

export default function PlaygroundTab() {
  const treeRef = useRef<TreeViewRef>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | number | null>(null);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  function addLog(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 10));
  }

  async function handleExpandNode(nodeId: string) {
    addLog(`Expanding node: ${nodeId}`);
    await treeRef.current?.expandNode(nodeId);
    addLog(`Node expanded: ${nodeId}`);
  }

  function handleCollapseNode(nodeId: string) {
    treeRef.current?.collapseNode(nodeId);
    addLog(`Collapsing node: ${nodeId}`);
  }

  function handleSelectNode(nodeId: string) {
    treeRef.current?.selectNode(nodeId);
    addLog(`Selecting node: ${nodeId}`);
  }

  function handleExpandAll() {
    treeRef.current?.expandAll();
    addLog('Expanding all nodes');
  }

  function handleCollapseAll() {
    treeRef.current?.collapseAll();
    addLog('Collapsing all nodes');
  }

  function handleGetSelectedNodeId() {
    const id = treeRef.current?.getSelectedNodeId();
    setSelectedNodeId(id || null);
    addLog(`Current selected node ID: ${id}`);
  }

  function handleGetTreeData() {
    const data = treeRef.current?.getTreeData();
    console.log('Current tree data:', data);
    addLog('Tree data retrieved (check console)');
  }

  const handleNodeClick = (node: TreeNode) => {
    setSelectedNode(node);
    addLog(`Node clicked: ${node.name} (${node.id})`);
  };

  const handleSelectedNodeIdChange = (nodeId: string | number) => {
    addLog(`Selection changed to: ${nodeId}`);
  };

  const handleNodeExpand = (node: TreeNode) => {
    addLog(`Loading children for: ${node.name} (${node.id})`);
    return mockAsyncLoader(node);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2'>Playground</h2>

        <p className='text-gray-600 dark:text-gray-400'>
          Test ref control methods with dynamic data loading. See how expand, collapse, and select work with
          asynchronously loaded nodes.
        </p>
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {/* Left Column - TreeView and Selected Node Info */}
        <div className='space-y-6'>
          {/* TreeView Demo */}
          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>Dynamic TreeView</h3>

            <p className='text-xs text-gray-500 dark:text-gray-400 mb-4'>
              Expand folders to load children dynamically. Try using ref methods on both loaded and unloaded nodes!
            </p>

            <TreeView
              reference={treeRef}
              initialState={dynamicTreeData}
              onNodeClick={handleNodeClick}
              onNodeExpand={handleNodeExpand}
              onSelectedNodeIdChange={handleSelectedNodeIdChange}
              shouldExpandOnClick
              className='max-h-96 overflow-auto border border-gray-300 dark:border-gray-600 p-4 rounded'
            />
          </div>

          {/* Selected Node Info */}
          {selectedNode && (
            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>Selected Node</h3>

              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-600 dark:text-gray-400'>Name:</span>
                  <span className='font-mono text-gray-900 dark:text-gray-100'>{selectedNode.name}</span>
                </div>

                <div className='flex justify-between'>
                  <span className='text-gray-600 dark:text-gray-400'>ID:</span>
                  <span className='font-mono text-gray-900 dark:text-gray-100'>{selectedNode.id}</span>
                </div>

                <div className='flex justify-between'>
                  <span className='text-gray-600 dark:text-gray-400'>Type:</span>
                  <span className='font-mono text-gray-900 dark:text-gray-100'>{selectedNode.type}</span>
                </div>

                <div className='flex justify-between'>
                  <span className='text-gray-600 dark:text-gray-400'>Has Children:</span>

                  <span className='font-mono text-gray-900 dark:text-gray-100'>
                    {selectedNode.items ? `Yes (${selectedNode.items.length})` : 'No'}
                  </span>
                </div>

                <div className='flex justify-between'>
                  <span className='text-gray-600 dark:text-gray-400'>Expanded:</span>

                  <span className='font-mono text-gray-900 dark:text-gray-100'>
                    {selectedNode.isExpanded ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Control Panel */}
        <div className='space-y-6'>
          {/* Control Panel */}
          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>Ref Control Panel</h3>

            <div className='space-y-4'>
              {/* Expand/Collapse All */}
              <div>
                <h4 className='text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide'>
                  Global Actions
                </h4>

                <div className='flex gap-2'>
                  <Button
                    onClick={handleExpandAll}
                    className='flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm'
                  >
                    Expand All
                  </Button>

                  <Button
                    onClick={handleCollapseAll}
                    className='flex-1 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm'
                  >
                    Collapse All
                  </Button>
                </div>
              </div>

              {/* Common Nodes - Dynamic */}
              <div>
                <h4 className='text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide'>
                  Root Nodes
                </h4>

                <div className='flex flex-col gap-2'>
                  <div className='flex gap-2'>
                    <Button
                      onClick={() => handleExpandNode('root')}
                      className='flex-1 px-2 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-xs'
                    >
                      Expand "root"
                    </Button>

                    <Button
                      onClick={() => handleCollapseNode('root')}
                      className='flex-1 px-2 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-xs'
                    >
                      Collapse "root"
                    </Button>

                    <Button
                      onClick={() => handleSelectNode('root')}
                      className='flex-1 px-2 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded text-xs'
                    >
                      Select
                    </Button>
                  </div>

                  <div className='flex gap-2'>
                    <Button
                      onClick={() => handleExpandNode('docs')}
                      className='flex-1 px-2 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-xs'
                    >
                      Expand "docs"
                    </Button>

                    <Button
                      onClick={() => handleCollapseNode('docs')}
                      className='flex-1 px-2 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-xs'
                    >
                      Collapse "docs"
                    </Button>

                    <Button
                      onClick={() => handleSelectNode('docs')}
                      className='flex-1 px-2 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded text-xs'
                    >
                      Select
                    </Button>
                  </div>
                </div>
              </div>

              {/* Nested Nodes - Only available after loading */}
              <div>
                <h4 className='text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide'>
                  Nested Nodes (Load First)
                </h4>

                <div className='flex flex-col gap-2'>
                  <div className='flex gap-2'>
                    <Button
                      onClick={() => handleExpandNode('root-src')}
                      className='flex-1 px-2 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-xs'
                    >
                      Expand "src"
                    </Button>

                    <Button
                      onClick={() => handleSelectNode('root-src')}
                      className='flex-1 px-2 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded text-xs'
                    >
                      Select "src"
                    </Button>
                  </div>

                  <div className='flex gap-2'>
                    <Button
                      onClick={() => handleSelectNode('src-components')}
                      className='flex-1 px-2 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded text-xs'
                    >
                      Select "components"
                    </Button>

                    <Button
                      onClick={() => handleSelectNode('comp-button')}
                      className='flex-1 px-2 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded text-xs'
                    >
                      Select "Button.tsx"
                    </Button>
                  </div>
                </div>
              </div>

              {/* Get State */}
              <div>
                <h4 className='text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide'>
                  Query State
                </h4>
                <div className='flex gap-2'>
                  <Button
                    onClick={handleGetSelectedNodeId}
                    className='flex-1 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded text-sm'
                  >
                    Get Selection
                  </Button>

                  <Button
                    onClick={handleGetTreeData}
                    className='flex-1 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded text-sm'
                  >
                    Get Tree
                  </Button>
                </div>
              </div>

              {/* Current State Display */}
              {selectedNodeId !== null && (
                <div className='p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800'>
                  <p className='text-xs font-medium text-gray-700 dark:text-gray-300'>Selected Node ID:</p>
                  <p className='text-sm text-gray-600 dark:text-gray-400 font-mono mt-1'>{selectedNodeId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Activity Log */}
          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Activity Log</h3>
              <Button
                onClick={clearLogs}
                className='px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white rounded text-xs'
              >
                Clear
              </Button>
            </div>
            <div className='space-y-1 max-h-64 overflow-y-auto font-mono text-xs'>
              {logs.length === 0 ? (
                <p className='text-gray-400 dark:text-gray-500 italic'>No activity yet...</p>
              ) : (
                logs.map((log, idx) => (
                  <div
                    key={idx}
                    className='text-gray-700 dark:text-gray-300 py-1 border-b border-gray-100 dark:border-gray-700'
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div className='mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>Usage Example</h3>
        <CodeBlock
          language='typescript'
          code={`import { useRef } from 'react';
import TreeView, { type TreeViewRef, type TreeNode } from './TreeView';

const dynamicData = [
  { id: 'root', name: 'My Project', type: 'folder' },
  { id: 'config', name: 'config.json', type: 'file' },
];

const loadChildren = async (node: TreeNode): Promise<TreeNode[]> => {
  // Simulate API call
  const response = await fetch(\`/api/files/\${node.id}\`);
  return response.json();
};

function MyPlayground() {
  const treeRef = useRef<TreeViewRef>(null);

  return (
    <>
      <TreeView
        ref={treeRef}
        initialState={dynamicData}
        onNodeExpand={loadChildren}
        shouldExpandOnClick
      />
      
      {/* Control buttons work with dynamically loaded nodes */}
      <button onClick={async () => {
        // expandNode is async - it will load children if needed
        await treeRef.current?.expandNode('root');
        console.log('Root expanded and children loaded!');
      }}>
        Expand Root (will load children)
      </button>
      
      <button onClick={() => treeRef.current?.selectNode('nested-node-id')}>
        Select Dynamically Loaded Node
      </button>
      
      <button onClick={() => treeRef.current?.expandAll()}>
        Expand All (including dynamic nodes)
      </button>
    </>
  );
}`}
        />
      </div>
    </div>
  );
}
