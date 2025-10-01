import { useState, useCallback, useMemo } from "react";

interface UsePaginationProps {
  initialPage?: number;
  initialPageSize?: number;
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  canGoNext: boolean;
  canGoPrev: boolean;

  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotalItems: (total: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
}

export const usePagination = ({
  initialPage = 1,
  initialPageSize = 20,
}: UsePaginationProps = {}): [Pagination, Pagination] => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize]
  );

  const canGoNext = currentPage < totalPages;
  const canGoPrev = currentPage > 1;

  const setPage = useCallback(
    (page: number) => {
      const clamped = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(clamped);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    if (canGoNext) setCurrentPage((p) => p + 1);
  }, [canGoNext]);

  const prevPage = useCallback(() => {
    if (canGoPrev) setCurrentPage((p) => p - 1);
  }, [canGoPrev]);

  const goToFirstPage = useCallback(() => setCurrentPage(1), []);
  const goToLastPage = useCallback(() => setCurrentPage(totalPages), [totalPages]);

  const handleSetPageSize = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const handleSetTotalItems = useCallback(
    (total: number) => {
      setTotalItems(total);
      if (currentPage > Math.ceil(total / pageSize)) {
        setCurrentPage(Math.max(1, Math.ceil(total / pageSize)));
      }
    },
    [currentPage, pageSize]
  );

  const pagination: Pagination = {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    canGoNext,
    canGoPrev,
    setPage,
    setPageSize: handleSetPageSize,
    setTotalItems: handleSetTotalItems,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
  };

  return [pagination, pagination];
};
