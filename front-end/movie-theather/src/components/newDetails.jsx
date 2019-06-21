import React, { Component, useState, useEffect } from "react";
import { getMovieById } from "./../services/getMovieById";
import { getMovieActors } from "./../services/movieActors";
import { getMovieCategories } from "./../services/movieCategoryService";
import "../test.css";
import { Helmet } from "react-helmet";

export  function NewDetails ()   {

    const [movie,setMovie] = useState(null);
    const [actors, setActors] = useState(null);
    const [genres, setGenres] = useState(null);

   
    useEffect (
        () => {
            console.log("It rendered");
    });



    useEffect( () => {
        //const { id } = props.match.params;
        console.log("id");
     //   console.log(id);
        // waitMovie(id);
     //   waitActors(id);
        // waitGenres(id);
    } );

 //   async function waitActors(id) {
     //   const actors = await getMovieActors(id);
     //   setActors(actors);
      //  console.log("alti actori");
      //  console.log(actors);
  //  }

    // const waitGenres = async (id) => {
    //     const genres = await getMovieCategories(id);
    //     setGenres(genres);
    // }
    // const waitMovie = async (id) => { 
    //     const movie = await getMovieById(id);
    //     setMovie(movie);
    // }

   
    console.log("actori");
    console.log(actors);
    const actorsArr = actors.map(actor => actor.name);
    const genresArr = genres.map(genre => genre.genre);
    const imageSrc = "data:image/png;base64," + movie.photo;
    return (
      <>
        <Helmet>
          <title>{movie.title + " " + movie.year}</title>
          <meta name="description" content={movie.description} />
        </Helmet>
        <div className="p-3 movie-card">
          <h2 className="text-center text-light">
            {movie.title + " (" + movie.year + ")"}
          </h2>
        </div>
        <div className="d-flex align-content-center justify-content-center flex-wrap flex-lg-nowrap text-light movie-card">
          <img className="ml-4 movie-poster" src={imageSrc} alt={movie.title} />
          <div className="movie-card-details ml-4 mr-4 mt-4 ">
            <h5 className="text-success">
              <u>Actors:</u>{" "}
            </h5>

            <p className="text-light">
              <strong>{actorsArr.join(",")}</strong>
            </p>

            <h5 className="text-warning">
              <u>Categories:</u>{" "}
            </h5>
            <p className="text-light">
              <strong>{genresArr.join(",")}</strong>
            </p>

            <h5 className="text-primary">
              <u>Description:</u>{" "}
            </h5>
            <p className="col-lg-6 text-light">{movie.description}</p>
          </div>
        </div>
      </>
    );
}
