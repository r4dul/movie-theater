import React, { useState, useEffect } from "react";
import { movieUrl } from "../config.json";
import Rating from "react-rating";
import play from "../logo/play2.svg";
import "../blana.css";
import icon from "../logo/icon3.svg";
import remove from "../logo/delete.svg";
import cos from "../logo/cos3.svg";

import { toast } from "react-toastify";
import {
  addMovieToWatchlist,
  deleteFromWatchlist
} from "../services/userService";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import video from "../logo/video.svg";
import mark from "../logo/mark.svg";
import close from "../logo/close.svg";

const ImageCard = props => {
  let imageSrc = "data:image/png;base64,";

  const [rem, setRem] = useState(false);

  useEffect(() => {
    console.log("Render in image card", rem);
    renderDelete();
  }, []);

  const addMovie = (userId, movie) => {
    const { title: movieTitle, year: movieYear, id: movieId } = movie;
    console.log("watchlist", userId, movieId);

    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <img src={video} />
            <h1>Confirm to submit</h1>
            <p>
              Are you sure you want to <strong id="add">ADD</strong> the
              following movie to your watchlist?
            </p>
            <h3>
              {movieTitle} ({movieYear})
            </h3>
            <a
              onClick={() => {
                addMovieToWatchlist(userId, movieId)
                  .then(response => {
                    toast.info(
                      movieTitle +
                        " (" +
                        movieYear +
                        ") was added to your watchlist.",
                      {
                        className: "toast-class-info rotateY animated",
                        progressClassName: "fancy-progress",
                        closeButton: false
                      }
                    );
                    setRem(!rem);
                  })
                  .catch(error => {
                    toast.error(
                      "An error occured while trying to add this movie to your watchlist."
                    );
                  });
                onClose();
              }}
            >
              <img src={mark} id="yes" />
            </a>
            <a onClick={onClose}>
              <img src={close} id="no" />
            </a>
          </div>
        );
      }
    });
  };

  const removeMovie = (id, movie) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <img src={video} />
            <h1>Confirm to submit</h1>
            <p>
              Are you sure you want to <strong id="remove">REMOVE</strong> the
              following movie from your watchlist?
            </p>
            <h3>
              {movie.title} ({movie.year})
            </h3>
            <a
              onClick={async () => {
                deleteFromWatchlist(id, movie.id)
                  .then(response => {
                    toast.info(
                      "The movie " +
                        movie.title +
                        " (" +
                        movie.year +
                        ") was successfully removed from your watchlist",
                      {
                        className: "toast-class-success",
                        progressClassName: "fancy-progress",
                        closeButton: false
                      }
                    );
                    setRem(!rem);
                  })
                  .catch(err => {
                    toast.error(
                      "Error occured while removing the movie from your wishlist"
                    );
                  });
                onClose();
              }}
            >
              <img src={mark} id="yes" />
            </a>
            <a onClick={onClose}>
              <img src={close} id="no" />
            </a>
          </div>
        );
      }
    });
  };

  const {
    movie,
    addMovieToWishlist,
    user,
    ratingMovie,
    location,
    removeMovieFromWatchlist,
    deleteMovieById,
    searchTrailer,
    watchlist
  } = props;

  // console.log("Salutari din ImageCard");
  // console.log(user);

  const renderDeleteButton =
    typeof watchlist !== "undefined"
      ? watchlist.filter(w => w.id === movie.id).length > 0
        ? true
        : false
      : false;

  function renderDelete() {
    typeof watchlist !== "undefined"
      ? watchlist.filter(w => w.id === movie.id).length > 0
        ? setRem(true)
        : setRem(false)
      : setRem(false);
  }
  // const dav = handleMovie(movie.id);

  const renderRemoveButton =
    user !== null &&
    user.role &&
    user.role.filter(r => r.authority === "ROLE_ADMIN").length > 0 &&
    location &&
    location.localeCompare("/watchlist") !== 0;

  const renderWishListButtons =
    user === null || Object.getOwnPropertyNames(user).length < 1 ? false : true;

  return (
    <div key={movie.id} className="card">
      <div className="side">
        <div className="img-div">
          <img
            src={
              movie.photo.length > 0
                ? imageSrc + movie.photo
                : "https://upload.wikimedia.org/wikipedia/en/0/0c/Black_Panther_film_poster.jpg"
            }
            alt={movie.title + " " + movie.year}
            className="card-img-top "
          />
          <div className="div-thumb">
            <img
              onClick={() => searchTrailer(movie)}
              src={play}
              className="thumb"
              alt="YT button"
            />
            <img
              src={play}
              onClick={() => searchTrailer(movie)}
              className="mask"
              alt="YT button"
            />
          </div>
        </div>
      </div>
      <div className="card-body ">
        <a href={movieUrl + movie.id} title="Details">
          <h5 className="card-title">{movie.title}</h5>
        </a>

        {renderWishListButtons !== false &&
        location &&
        location.localeCompare("/watchlist") === 0 ? (
          <img
            src={remove}
            onClick={() => removeMovieFromWatchlist(user.id, movie)}
            className="add"
            alt="Remove"
          />
        ) : (
          ""
        )}

        {renderWishListButtons !== false &&
        location &&
        rem === true &&
        location.localeCompare("/watchlist") !== 0 ? (
          <img
            src={remove}
            onClick={() => removeMovie(user.id, movie)}
            className="add"
            alt="Remove"
          />
        ) : (
          ""
        )}

        {renderWishListButtons !== false &&
        location &&
        rem === false &&
        location.localeCompare("/watchlist") !== 0 ? (
          <img
            src={icon}
            onClick={() => addMovie(user.id, movie)}
            className="add"
            alt="Add"
          />
        ) : (
          ""
        )}

        {renderRemoveButton && (
          <img
            src={cos}
            onClick={() => deleteMovieById(movie)}
            className="add"
            id="del"
            alt="Remove"
          />
        
        )}

        {renderWishListButtons !== false && (
          <div className= {renderRemoveButton ? "rating" : "rating admin"}>
            <Rating
              start={0}
              stop={10}
              step={2}
              initialRating={movie.rating}
              emptySymbol="fa fa-star-o fa-1x low"
              fullSymbol="fa fa-star fa-1x low"
              fractions={4}
              onChange={ev => ratingMovie(ev, movie.id)}
            />
          </div>
        )}

        {/* {renderRemoveButton && (
          <button
          id="remove"
            type="button"
            className="btn btn-danger"
            onClick={() => deleteMovieById(movie)}
          >
            Remove
          </button>
        )} */}
      </div>
    </div>
  );
};

export default ImageCard;
