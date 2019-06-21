import React from "react";
import { addMovieReview } from "../services/movieReviewsService";
import { toast } from "react-toastify";

const Comment = ({ movieId }) => {
  function addReviewToMovie(ev) {
    //ev.preventDefault();
    const textarea = document.getElementById("textarea");
    const review = textarea.value;
    try {
      addMovieReview(review, movieId);
      //toast.success("Your review was added.");
      textarea.value = "";
    } catch (err) {
      toast.error("Your review could not be added.");
    }
  }

  return (
    <>
      <div className="reviews--box__label text-center text-secondary">
        <h2>Add a comment:</h2>
        <form onSubmit={addReviewToMovie}>
          <div className="comment-message-box">
            <textarea
              maxLength="255"
              id="textarea"
              className="text-white"
              rows="5"
              cols="60"
            />
            <br />
            <input
              type="submit"
              className="btn btn-info ml-0 mb-1"
              value="Submit Comment"
            />
          </div>
        </form>
      </div>
    </>
  );
};
export default Comment;