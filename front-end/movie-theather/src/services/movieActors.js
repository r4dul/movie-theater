import http from "./httpService";
import { apiUrl } from "../config.json";

export function getMovieActors(id) {
  return http.get(apiUrl + "movies/" + id + "/actors");
}
