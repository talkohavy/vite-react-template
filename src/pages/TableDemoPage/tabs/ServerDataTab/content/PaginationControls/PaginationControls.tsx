import clsx from 'clsx';

type PaginationControlsProps = {
  handlePageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  page: number;
  totalPages: number;
};

export default function PaginationControls(props: PaginationControlsProps) {
  const { handlePageChange, hasNextPage, hasPreviousPage, page, totalPages } = props;

  return (
    <div className='flex items-center justify-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700'>
      <button
        type='button'
        onClick={() => handlePageChange(1)}
        disabled={!hasPreviousPage}
        className='px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500'
      >
        First
      </button>

      <button
        type='button'
        onClick={() => handlePageChange(page - 1)}
        disabled={!hasPreviousPage}
        className='px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500'
      >
        Previous
      </button>

      <div className='flex items-center gap-1'>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const startPage = Math.max(1, Math.min(page - 2, totalPages - 4));
          const pageNum = startPage + i;

          if (pageNum > totalPages) return null;

          return (
            <button
              key={pageNum}
              type='button'
              onClick={() => handlePageChange(pageNum)}
              className={clsx(
                'px-3 py-1.5 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
                pageNum === page
                  ? 'bg-blue-500 text-white'
                  : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700',
              )}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        type='button'
        onClick={() => handlePageChange(page + 1)}
        disabled={!hasNextPage}
        className='px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500'
      >
        Next
      </button>

      <button
        type='button'
        onClick={() => handlePageChange(totalPages)}
        disabled={!hasNextPage}
        className='px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500'
      >
        Last
      </button>
    </div>
  );
}
