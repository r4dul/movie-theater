import http from "./httpService";
import { apiUrl } from "../config.json";

export function getActors() {
  return http.get(apiUrl + "actors");
}
