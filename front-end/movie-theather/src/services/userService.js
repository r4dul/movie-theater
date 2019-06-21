import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "users";

export function getUserById(id) {
  return http.get(apiEndpoint + "/" + id);
}

export function getAllMovies(id, query = "") {
  console.log(apiEndpoint + "/" + id + "/movies" + query);
  return http.get(apiEndpoint + "/" + id + "/movies" + query);
}
export function deleteFromWatchlist(userId, movieId) {
  console.log(apiUrl + "users/" + userId + "/" + movieId);
  return http.delete(apiUrl + "users/" + userId + "/" + movieId);
}

export function deleteUserAccount(userId) {
  console.log(apiUrl + "users/" + userId);
  return http.delete(apiUrl + "users/" + userId);
}

export function updatePhoto(user) {
  console.log("post" + apiUrl + "users/photo");
  console.log("photo from userService", user);
  http.post(apiUrl + "users/photo", {
    id: user.id,
    name: user.name,
    username: user.username,
    password: user.password,
    email: user.email,
    photo: user.photo,
    age: user.age
  });
}

export function updateUser(user) {
  console.log("put" + apiUrl + "users");
  http.put(apiUrl + "users", user);
}

export function addMovieToWatchlist(userId, movieId) {
  console.log(
    "add movie to watchlist",
    apiEndpoint + "/" + userId + "/" + movieId
  );
  return http.put(apiEndpoint + "/" + userId + "/" + movieId);
}

export function addUser(user) {
  return http.post(apiEndpoint, {
    name: user.name,
    username: user.username,
    password: user.password,
    email: user.email,
    age: user.age
  });
}
