import http from "./httpService";

export function verifyEmailService(endpoint) {
  console.log(endpoint);
  return http.get(endpoint);
}
