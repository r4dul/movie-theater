import React from "react";

const MovieDetails = ({ actorsArr, genresArr, movie, imageSrc }) => {
  return (
    <>
      <div className="d-flex align-content-center justify-content-center flex-wrap flex-lg-nowrap text-light movie-card">
        <img
          className="ml-4 mr-4 movie-poster"
          src={imageSrc}
          alt={movie.title}
        />
        <div className="movie-card-details ml-4 mr-4 mt-lg-4">
          <h5 className="text-success">
            <u>Actors:</u>{" "}
          </h5>

          <p className="text-light">
            <strong>{actorsArr.join(", ")}</strong>
          </p>

          <h5 className="text-warning">
            <u>Categories:</u>{" "}
          </h5>
          <p className="text-light">
            <strong>{genresArr.join(", ")}</strong>
          </p>

          <h5 className="text-primary">
            <u>Description:</u>{" "}
          </h5>
          <p className="text-light">{movie.description}</p>
        </div>
      </div>
    </>
  );
};

export default MovieDetails;
