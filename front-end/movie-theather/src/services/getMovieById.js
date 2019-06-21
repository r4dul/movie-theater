import http from "./httpService";
import { apiUrl } from "../config.json";

export function getMovieById(id) {
  return http.get(apiUrl + "movies/" + id);
}
