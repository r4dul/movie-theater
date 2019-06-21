import http from "./httpService";
import { apiUrl } from "../config.json";
import axios from "axios";

export function getMovies(queryString = "") {
  console.log(apiUrl + "movies" + queryString);

  return http.get(apiUrl + "movies" + queryString);
}

export function getMoviesByTitle(title) {
  if (title === "") return http.get(apiUrl + "movies");

  return http.get(apiUrl + "movies/title/" + title).catch(e => {
    return "404";
  });
}

export function getMoviesByGenre(queryString = "") {
  console.log(apiUrl + "movies/genre/" + queryString);
  return http.get(apiUrl + "movies/genre/" + queryString);
}

export function deleteMovie(id) {
  console.log("remove url", apiUrl + "movies/" + id);
  return http.delete(apiUrl + "movies/" + id);
}

export function addMovie(movie) {
  return http.post(apiUrl + "movies", movie);
}

export function addMovies(movie) {
  console.log(apiUrl + "movies/add");
  return http.post(apiUrl + "movies/add", movie);
}

export function addRatingToMovie(movieId, rating) {
  console.log(apiUrl + "movies/" + movieId + "/" + rating);
  return http.put(apiUrl + "movies/" + movieId + "/" + rating);
}

export function updateMovie(movie, movieId) {
  console.log("update movie ", apiUrl + "movies/" + movieId);
  return http.put(apiUrl + "movies/" + movieId, movie);
}

export function seachMovieTrailer(movieTitle) {
  console.log(
    "https://api.themoviedb.org/3/search/movie?api_key=ef7b017a63adfad428be3a6577623647&query=" +
      movieTitle
  );
  return http.get(
    "https://api.themoviedb.org/3/search/movie?api_key=ef7b017a63adfad428be3a6577623647&query=" +
      movieTitle
  );
}

export function searchTrailerByMovieId(movieId) {
  console.log(
    "https://api.themoviedb.org/3/movie/" +
      movieId +
      "/videos?api_key=ef7b017a63adfad428be3a6577623647"
  );

  let url =
    "https://api.themoviedb.org/3/movie/" +
    movieId +
    "/videos?api_key=ef7b017a63adfad428be3a6577623647";

  return axios
    .get(`${"https://cors-anywhere.herokuapp.com/"}${url}`, {
      responseType: "json"
    })
    .then(response => response);

  return http.get(
    "https://api.themoviedb.org/3/movie/" +
      movieId +
      "/videos?api_key=ef7b017a63adfad428be3a6577623647"
  );
}
