const rows = [
  { id: 1, name: 'Alice Johnson', role: 'Engineer', department: 'R&D' },
  { id: 2, name: 'Bob Martinez', role: 'Designer', department: 'Product' },
  { id: 3, name: 'Carol Smith', role: 'Manager', department: 'Operations' },
  { id: 4, name: 'David Lee', role: 'Analyst', department: 'Finance' },
  { id: 5, name: 'Eva Brown', role: 'Developer', department: 'R&D' },
];

function exportToJson() {
  const json = JSON.stringify(rows, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.json';
  a.click();
  URL.revokeObjectURL(url);
}

export default function HomePage() {
  return (
    <div className='size-full flex flex-col gap-6 overflow-auto p-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-100'>Employees</h1>
        <button
          type='button'
          onClick={exportToJson}
          className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 active:scale-95 transition-all'
        >
          Export JSON
        </button>
      </div>

      <div className='overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm'>
        <table className='w-full text-sm text-left text-gray-700 dark:text-gray-300'>
          <thead className='bg-gray-50 dark:bg-gray-800 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400'>
            <tr>
              <th className='px-6 py-3'>ID</th>
              <th className='px-6 py-3'>Name</th>
              <th className='px-6 py-3'>Role</th>
              <th className='px-6 py-3'>Department</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-900'>
            {rows.map((row) => (
              <tr key={row.id} className='hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
                <td className='px-6 py-4 font-mono text-gray-400 dark:text-gray-500'>{row.id}</td>
                <td className='px-6 py-4 font-medium text-gray-900 dark:text-gray-100'>{row.name}</td>
                <td className='px-6 py-4'>{row.role}</td>
                <td className='px-6 py-4'>{row.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
