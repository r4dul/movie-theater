import http from "./httpService";
import { usersUrl } from "../config.json";

export function checkUserByEmail(email) {
  const endPoint = usersUrl + "email?email=" + email;
  console.log(endPoint);
  return http.get(endPoint);
}
