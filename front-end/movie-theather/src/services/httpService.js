import axios from "axios";
import { toast } from "react-toastify";
// we can log the errors using sentry

axios.interceptors.response.use(function(response) {
  
  return response;
 }, function(error) {
    if(401=== error.response.status) {
      
      
      localStorage.removeItem("token");  
      window.location = '/login';
      toast.error("Your session expired");
      
    }else {
      
      return Promise.reject(error);
    }
  });


function setJwt(jwt) {
  axios.defaults.headers.common["Authorization"] = jwt;
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt
};
