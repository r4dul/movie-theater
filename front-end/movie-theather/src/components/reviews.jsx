import React, { useState, useEffect } from "react";
import { getMovieReviews } from "./../services/movieReviewsService";
import Review from "./review";
import Comment from "./comment";
import auth from "../services/authService";
import ReactPaginate from "react-paginate";
import { paginate } from "./../utils/paginate";


const Reviews = props => {
  console.log("props", props.movieId);
  const [reviews, setReviews] = useState();
  const user = auth.getCurrentUser();
  const [pagination, setPagination] = useState();
  //console.log(user);

  async function fetchReviews() {
    let response = await getMovieReviews(props.movieId);
    console.log("this is the response", response);
    let newPagination = {};
    newPagination.totalPages = response.data.totalPages;
    newPagination.numberOfElements = response.data.numberOfElements;
    newPagination.totalElements = response.data.totalElements;
    newPagination.pageSize = response.data.pageable.pageSize;
    setReviews(response.data.content);
    setPagination(newPagination);
  }

  console.log("pagination: ", pagination);

  async function onPageChange(onChangeObj) {
    let pageNumber = Object.values(onChangeObj)[0];
    let queryString = "?page=" + pageNumber;
    let response = await getMovieReviews(props.movieId, queryString);
    setReviews(response.data.content);
    console.log("page change");
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <>
      {user && <Comment movieId={props.movieId} />}
      {props.movie.reviews.length > 0 && (
        <>
          <div className="reviews--box__label text-center text-secondary">
            <h2>Reviews:</h2>
          </div>
          <div id="comments-box" className="reviews--box m-xl-5 mw-20 ">
            {reviews !== undefined
              ? reviews.map(review => {
                  return (
                    <Review
                      key={review.id}
                      review={review}
                      currentUser={user}
                    />
                  );
                })
              : ""}
          </div>
        </>
      )}
      
      {pagination !== undefined && pagination.totalPages > 1 && (
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"+5"}
          breakClassName={"break-me"}
          pageCount={pagination.totalPages}
          marginPagesDisplayed={0}
          pageRangeDisplayed={5}
          onPageChange={onPageChange}
          containerClassName={
            "d-flex justify-content-center pagination pagination--bar"
          }
          activeClassName={"page-item active"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          initialPage={0}
          previousClassName={"page-link bg-dark"}
          nextClassName={"page-link bg-dark"}
          breakLinkClassName={"page-link bg-dark"}
          //forcePage={}
          disabledClassName={"d-none"}
        />
      )}
    </>
  );
};

export default Reviews;
