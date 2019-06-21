import React, { Component } from "react";
import { addMovie } from "../services/movieService";
import http from "../services/httpService";
import axios from "axios";
import { getGenres } from "../services/genreService";

let genres;
class OmdbApi extends Component {
  async componentDidMount() {
    const genresData = await getGenres();
    genres = genresData.data;
  }

  render() {
    let i = 694;
    let url2;

    let movie = {};

    let movies = [{}];

    while (i < 750) {
      url2 = "http://www.omdbapi.com/?apikey=bf3ef3c5&i=tt4633" + i;
      getData(url2);
      console.log("url2", url2);
      i++;
    }

    let j = 0;
    setTimeout(() => {
      const newArray = movies.filter(value => Object.keys(value).length !== 0);
      console.log("timeout movies", movies);
      newArray.forEach(movie => {
        if (movie.title) {
          addMovie(movie);
        }
      });
    }, 10000);

    //let movies = [{}];

    //console.log("movies all", movies);

    /*   function getMovies(url, i) {
    axios
      .get(`${"https://cors-anywhere.herokuapp.com/"}${url}`, {
        responseType: "json"
      })
      .then(response => response.data)
      .then(response => movies.push(response))
      .then(response => {
        if (i == 33) console.log("movies all", movies);
      });
  } */

    function getData(url) {
      axios
        .get(`${"https://cors-anywhere.herokuapp.com/"}${url}`, {
          responseType: "json"
        })
        .then(response => response.data)
        .then(response => {
          movie = {};
          //console.log("data", response);
          const {
            Title: title,
            Plot: description,
            Year: year,
            imdbRating: rating
          } = response;
          movie = { title, description, year, rating };
          let genresArray = response.Genre.split(",");
          //movie.genres = [{}]
          if (genresArray.length > 0) {
            movie.genres = genres.filter(genre => {
              return genresArray.includes(genre.genre);
            });
          }
          //movie.genres = response.Genre.split(",");
          movie.actors = response.Actors.split(",");
          movie.movieGenresStringList = response.Genre.split(",");
          //console.log("movieeee", movie);
          return response;
        })
        .then(response => getPhoto(response.Poster, movie));
    }

    function getPhoto(url, currentMovie) {
      axios
        .get(`${"https://cors-anywhere.herokuapp.com/"}${url}`, {
          responseType: "arraybuffer"
        })
        .then(response => {
          let image = btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );
          let res = `data:${response.headers[
            "content-type"
          ].toLowerCase()};base64,${image}`;
          let photo = res.split(",")[1];
          currentMovie.photo = photo;
          //console.log(photo);
          //console.log("new array", movies);
          movies.push(currentMovie);
          //console.log("moviesss", movies);
          //addMovie(movie);

          return response;
        });
    }
    return <h1>Hello</h1>;
  }
}

export default OmdbApi;
