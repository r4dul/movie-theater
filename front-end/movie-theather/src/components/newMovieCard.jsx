import React, { Component } from "react";
import { movieUrl } from "../config.json";
import Rating from "react-rating";
import play from '../logo/play2.svg';
import logo from '../logo/play.svg';

const NewMovieCard = props => {
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
    
    <div key={movie.id} className="card">
    
      <div className="img-div">
        <img
          src={
            movie.photo.length > 0
              ? imageSrc + movie.photo
              : "https://upload.wikimedia.org/wikipedia/en/0/0c/Black_Panther_film_poster.jpg"
          }
          alt={movie.title + " " + movie.year}
          className="card-img-top rounded "
        />
        <img
          onClick={() => searchTrailer(movie)}
          //src="https://png2.kisspng.com/sh/7fc51def17bb9a39a2cec0b6a29ad471/L0KzQYm3U8IxN6dpiZH0aYP2gLBuTfNwdaF6jNd7LXnmf7B6TglwfaV6etc2cHzkiX7plgR1d58ye95ycD3kgsW0ifNwdl51htk2cHzkiX7plgR1d58yTdNrMUG0Q4W5U8FnbWgzSqk8MUO3RIK4VcIyPWY4T6MBMUS2SXB3jvc=/kisspng-computer-icons-youtube-play-button-clip-art-icon-png-play-button-5ab11134231fe7.2731344115215537161439.png"
            src={play}
          className="thumb"
        />
      </div>
      <div className="card-body ">
      { renderWishListButtons !== false && <div className="rating" style={{textAlign:"center"}}>
          <Rating
            start={0}
            stop={10}
            step={2}
            initialRating={movie.rating}
            emptySymbol="fa fa-star-o fa-2x low"
            fullSymbol="fa fa-star fa-2x low"
            fractions={4}
            onChange={ev => ratingMovie(ev, movie.id)}
          />
        </div>}
      <a href={movieUrl + movie.id} title="Details">
        <h5 className="card-title">{movie.title}</h5>
        </a>
        <p>{"(" + movie.year + ")"}</p>
        <p className="card-text"> Category: {movie.movieGenresStringList}</p>
        

        {renderWishListButtons !== false &&
        location &&
        location.localeCompare("/watchlist") === 0 ? (
          <button
            type="button"
            className="btn btn-danger "
            onClick={() => removeMovieFromWatchlist(user.id, movie)}
          >
            Remove from watchlist
          </button>
        ) : (
          ""
        )}

        {renderWishListButtons !== false &&
        location &&
        location.localeCompare("/watchlist") !== 0 ? (
          <button
          id="add"
            type="button "
            className="btn btn-danger"
            onClick={() => addMovieToWishlist(user.id, movie)}
          >
            <img src={logo}/>
          </button>
        ) : (
          ""
        )}

        {renderRemoveButton && (
          <button
          id="remove"
            type="button"
            className="btn btn-danger"
            onClick={() => deleteMovieById(movie)}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default NewMovieCard;
