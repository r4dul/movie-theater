import React from "react";
import { movieUrl } from "../config.json";
import Rating from "react-rating";
import play from "../logo/play2.svg";
import "../blana.css";
import icon from "../logo/icon3.svg";
import remove from "../logo/delete.svg";



const ImageCard = props => {
  let imageSrc = "data:image/png;base64,";

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
      typeof watchlist !== "undefined" ?  watchlist.filter(w => w.id === movie.id).length > 0 ? true : false : false;


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
    <div key={movie.id} className="card" >
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
        renderDeleteButton === true &&
        location.localeCompare("/watchlist") !== 0 ? (
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
        renderDeleteButton === false &&
        location.localeCompare("/watchlist") !== 0 ? (
          <img
            src={icon}
            onClick={() => addMovieToWishlist(user.id, movie)}
            className="add"
            alt="Add"
          />
        ) : (
          ""
        )}

        {renderWishListButtons !== false && (
          <div className="rating">
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
