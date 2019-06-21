import React from "react";
import { movieUrl } from "../config.json";
import Rating from "react-rating";

const MovieCard = props => {
  let imageSrc = "data:image/png;base64,";

  const {
    movie,
    addMovieToWishlist,
    user,
    ratingMovie,
    location,
    removeMovieFromWatchlist,
    deleteMovieById,
    searchTrailer
  } = props;

  const renderRemoveButton =
    user !== null &&
    user.role &&
    user.role.filter(r => r.authority === "ROLE_ADMIN").length > 0 &&
    location &&
    location.localeCompare("/watchlist") !== 0;

  const renderWishListButtons =
    user === null || Object.getOwnPropertyNames(user).length < 1 ? false : true;
  return (
    <>
      <div key={movie.id} className="movie-block">
        <a href={movieUrl + movie.id} title={movie.title + " " + movie.year}>
          <div className="image--container">
            <img
              src={
                movie.photo.length > 0
                  ? imageSrc + movie.photo
                  : "https://upload.wikimedia.org/wikipedia/en/0/0c/Black_Panther_film_poster.jpg"
              }
              alt={movie.title + " " + movie.year}
            />
          </div>
        </a>
        {console.log("user from render if ", renderWishListButtons)}
        {renderWishListButtons !== false &&
        location &&
        location.localeCompare("/watchlist") === 0 ? (
          <div className="text-center wishlist--button">
            <button
              onClick={() => removeMovieFromWatchlist(user.id, movie)}
              type="button"
              className="btn btn-danger"
            >
              Remove from Watchlist
            </button>
            <button
              onClick={() => searchTrailer(movie)}
              type="button"
              className="btn btn-danger"
            >
              Search Trailer
            </button>
          </div>
        ) : (
          ""
        )}
        {renderWishListButtons !== false &&
        location &&
        location.localeCompare("/watchlist") !== 0 ? (
          <div className="text-center wishlist--button">
            <button
              onClick={() => addMovieToWishlist(user.id, movie)}
              type="button"
              className="btn btn-danger"
            >
              Add to Watchlist
            </button>
            <button
              onClick={() => searchTrailer(movie)}
              type="button"
              className="btn btn-danger"
            >
              Search Trailer
            </button>
          </div>
        ) : (
          ""
        )}

        <div className="movie-details">
          <h4>
            {" "}
            {movie.title} {" (" + movie.year + ")"}
          </h4>
          <p>Category: {movie.movieGenresStringList}</p>
          <div className="rating">
            <Rating
              start={0}
              stop={10}
              step={2}
              initialRating={movie.rating}
              emptySymbol="fa fa-star-o fa-1x low"
              fullSymbol="fa fa-star fa-1x low"
              fractions={2}
              onChange={ev => ratingMovie(ev, movie.id)}
            />
          </div>
        </div>
        {renderRemoveButton && (
          <div className="text-center wishlist--button">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => deleteMovieById(movie)}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MovieCard;
