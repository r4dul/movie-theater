import { getUserById } from "./../services/userService";
import React, { useState, useEffect } from "react";
import { removeMovieReview } from "../services/movieReviewsService";
import { toast } from "react-toastify";

const Review = ({ review, currentUser, triggerRender }) => {
  //console.log("review", review);
  //const { user } = review;

  let imageSrc = "data:image/png;base64,";

  const [user, setUser] = useState();

  async function getUser() {
    let response = await getUserById(review.userId);
    //console.log("response", response.data);
    setUser(response.data);
  }

  function deleteMovieReview(ev) {
    console.log("delete movie review", review);
    try {
      removeMovieReview(review.id);
      toast.success("The review was succeseffuly removed.");
    } catch (err) {
      toast.error("We could not removed the review.");
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <div>
        {user !== undefined ? (
          <div className="comment-user-details d-flex align-items-center pl-lg-2 pl-sm-2 h4">
            <a href={"/profile/" + user.id}>
              {" "}
              {user.photo === null ? (
                <img
                  className="pl-2"
                  src={
                    "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
                  }
                  alt={user.name}
                />
              ) : (
                <img
                  className="pl-2"
                  src={imageSrc + user.photo}
                  alt={user.name}
                />
              )}
            </a>
            <div className="user--message pl-2">
              <p className="text-white">
                <span className="text-warning">{user.username}:</span>{" "}
                {review.reviewMessage}{" "}
                {currentUser &&
                  currentUser.role.filter(r => r.authority === "ROLE_ADMIN")
                    .length > 0 && (
                    <button
                      type="submit"
                      onClick={deleteMovieReview}
                      className="btn btn-sm btn-danger"
                    >
                      Delete Comment
                    </button>
                  )}
              </p>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Review;
