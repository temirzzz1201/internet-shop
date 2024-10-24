'use client';

import { Box, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage }) => {
  const router = useRouter();
  const [page, setPage] = useState(currentPage);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      router.push(`/?page=${newPage}`);
    }
  };

  const renderPageButtons = () => {
    const buttons = [];
    const maxButtonsToShow = 5;
    let startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);

    if (endPage - startPage < maxButtonsToShow - 1) {
      startPage = Math.max(1, endPage - maxButtonsToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          variant={i === page ? 'solid' : 'outline'}
          colorScheme={i === page ? 'teal' : 'gray'}
          mr={2}
        >
          {i}
        </Button>
      );
    }
    return buttons;
  };

  return (
    <Box display="flex" justifyContent="center" mt="20px">
      <Button
        onClick={() => handlePageChange(page - 1)}
        isDisabled={page === 1}
        mr={2}
      >
        Предыдущая
      </Button>
      {renderPageButtons()}
      <Button
        onClick={() => handlePageChange(page + 1)}
        isDisabled={page === totalPages}
      >
        Следующая
      </Button>
    </Box>
  );
};

export default Pagination;
