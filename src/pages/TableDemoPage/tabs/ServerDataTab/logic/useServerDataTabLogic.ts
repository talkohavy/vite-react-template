import { useState } from 'react';
import { useAsyncFetch } from '../../../../../hooks/useAsyncFetch';
import { httpClient } from '../../../../../lib/HttpClient';
import { usePagination } from './hooks/usePagination';
import type { UsersResponse } from '../types';

export function useServerDataTabLogic() {
  const { handlePageChange, handleLimitChange, limit, page } = usePagination();

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const asyncFunc = () => {
    return httpClient.get<UsersResponse>(`/api/users?page=${page}&limit=${limit}&sortOrder=${sortOrder}`);
  };

  const { data, isLoading, isError } = useAsyncFetch<UsersResponse>({
    asyncFunc,
    dependencies: [page, limit, sortOrder],
  });

  const handleSortOrderToggle = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const { page: currentPage, totalPages, totalItems, hasNextPage, hasPreviousPage } = data?.meta || ({} as any);
  const tableData = data?.data || [];

  return {
    limit,
    handleLimitChange,
    handleSortOrderToggle,
    sortOrder,
    // async fetch data:
    tableData,
    isLoading,
    isError,
    handlePageChange,
    // metadata:
    currentPage,
    totalPages,
    totalItems,
    hasNextPage,
    hasPreviousPage,
  };
}
