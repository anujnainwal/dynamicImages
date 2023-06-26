import React, { useState } from "react";
import { Pagination } from "react-bootstrap";

const Paginations = ({
  data,
  page,
  setPage,
  handleNextPage,
  handlePrevPage,
}) => {
  let {
    count,
    hasNextPage,
    hasPrevPage,
    lastPage,
    nextPage,
    currentPage,
    privousPage,
  } = data;

  return (
    <>
      <Pagination>
        {hasPrevPage && <Pagination.Prev onClick={handlePrevPage} />}
        {/* {currentPage !== privousPage && privousPage !== currentPage && (
          <Pagination.Item onClick={handlePrevPage}>
            {currentPage}
          </Pagination.Item>
        )} */}

        {currentPage && <Pagination.Item>{currentPage}</Pagination.Item>}
        {hasNextPage && <Pagination.Next onClick={handleNextPage} />}
        {/* {lastPage !== currentPage && nextPage !== lastPage && (
          <Pagination.Last />
        )} */}
      </Pagination>
    </>
  );
};

export default Paginations;
