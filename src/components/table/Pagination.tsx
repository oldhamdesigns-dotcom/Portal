import { memo, useMemo } from 'react';
import Dropdown from '@components/forms/Dropdown';
import { cn } from '@utils/CN';
import useMenu from '@hooks/useMenu';
import CaretArrowIcon from '@icons/arrows/CaretArrowIcon';

const PageSizes = [
  5, 15, 25, 50,
];

type PaginationProps = {
  pageSize?: string | number;
  page?: string | number;
  onChangePageSize: (pageSize: string) => void;
  onChangePage: (page: number) => void;
  pageData?: Page
}

const MAX_PAGE_SIZE = 4;

const Pagination = ({ pageSize = 15, onChangePageSize, page = 0, onChangePage, pageData }: PaginationProps) => {

  const pageSizeValue = useMemo(() => +pageSize, [pageSize]);
  const currentPage = useMemo(() => +page, [page]);

  const pageNumbers = useMemo(() => {
    let startPage = Math.max(1, (currentPage + 1) - Math.floor(MAX_PAGE_SIZE / 2));
    const endPage = Math.min(pageData?.totalPages ?? 0, startPage + MAX_PAGE_SIZE - 1);
    if (endPage - startPage + 1 < MAX_PAGE_SIZE) {
      startPage = Math.max(1, endPage - MAX_PAGE_SIZE + 1);
    }
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, pageData?.totalPages]);

  return <div className={'flex p-4 justify-between'}>
    <Dropdown
      options={PageSizes}
      selectedOption={pageSizeValue}
      onChange={onChangePageSize}
      buttonClassName={'bg-black text-white p-2 rounded-lg'}
      optionClassName={'hover:bg-white hover:text-black'}
      optionContainerClassName={'bg-black text-white'}
    />

    <div className={'flex gap-1'}>
      {currentPage !== 0 ?
        <button
          className={cn('flex justify-center items-center bg-white text-black border border-placeholder rounded-lg w-[32px] h-[40px]')}
          onClick={() => onChangePage(0)}
        >
          <CaretArrowIcon rotate={90} />
        </button>
        : null
      }
      {pageNumbers.map((page, idx) =>
        <button
          className={cn('bg-black text-white w-[32px] h-[40px] border border-placeholder rounded-lg', { 'bg-white text-black': (page - 1) !== currentPage })}
          onClick={() => onChangePage(page - 1)}
          key={'page-' + idx}>{page}</button>)}
      {currentPage !== ((pageData?.totalPages ?? 1) - 1) ?
        <button
          className={cn('flex justify-center items-center bg-white text-black border border-placeholder rounded-lg w-[32px] h-[40px]')}
          onClick={() => onChangePage((pageData?.totalPages ?? 1) - 1)}
        >
          <CaretArrowIcon rotate={-90} />
        </button> : null
      }

    </div>
  </div>;
};

export default memo(Pagination);