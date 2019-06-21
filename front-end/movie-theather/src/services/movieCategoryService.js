import http from "./httpService";
import { apiUrl } from "../config.json";

export function getMovieCategories(id) {
  return http.get(apiUrl + "movies/" + id + "/genres");
}
