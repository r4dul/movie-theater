import React from "react";
import _ from "lodash";

const Pagination = ({ pagination }) => {
  const {
    pageNumber,
    totalPages,
    pageSize,
    numberOfElements,
    onPageChange
  } = pagination;
  const currentPage = pageNumber === 0 ? 1 : pageNumber;
  console.log("current page lala", pageNumber);
  const pages = _.range(1, totalPages + 1);

  return (
    <div className="d-flex justify-content-center">
      <nav aria-label="Page navigation example">
        <ul className="pagination pagination--bar">
          {(pageNumber - 1 > 0) || (totalPages===0) ? (
            <li className="page-item">
              <a
                className="page-link"
                onClick={() => onPageChange(pageNumber - 1)}
              >
                Previous
              </a>
            </li>
          ) : null}
          {pages.map(page => (
            <li
              key={page}
              className={
                page === currentPage ? "page-item active" : "page-item"
              }
            >
              <a className="page-link" onClick={() => onPageChange(page)}>
                {page}
              </a>
            </li>
          ))}

          {(currentPage < totalPages) || (totalPages===0) ? (
            <li className="page-item">
              <a
                className="page-link"
                onClick={() => onPageChange(pageNumber + 1)}
              >
              
                Next
              </a>
            </li>
          ) : null}
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
