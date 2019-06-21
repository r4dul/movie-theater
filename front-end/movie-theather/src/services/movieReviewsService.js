import http from "./httpService";
import { apiUrl } from "../config.json";

export function getMovieReviews(movieId, queryString = "") {
  console.log(apiUrl + "reviews/" + movieId + queryString);
  return http.get(apiUrl + "reviews/" + movieId + queryString);
}

export function addMovieReview(review, movieId) {
  console.log("post review ", apiUrl + "reviews/" + movieId);
  const movieReview = { reviewMessage: review };
  console.log(movieReview);
  return http.post(apiUrl + "reviews/" + movieId, movieReview);
}

export function removeMovieReview(reviewId) {
  console.log("remove review " + apiUrl + "reviews/" + reviewId);
  return http.delete(apiUrl + "reviews/" + reviewId);
}
