import http from "./httpService";
import { usersUrl } from "../config.json";

export function checkIfUsernameExists(username) {
  const endPoint = usersUrl + "user?username=" + username;
  console.log(endPoint);
  return http.get(endPoint);
}
