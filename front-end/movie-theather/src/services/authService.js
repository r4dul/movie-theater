import http from "./httpService";
import {loginUrl} from ".././config.json";
import * as jwt_decode from 'jwt-decode';

http.setJwt(getJwt());

export async function login(username,password) {
     const {data:jwt} = await http.post(loginUrl+ "login", {username,password});
     localStorage.setItem("token",jwt["token"]);
    
}

export function logout() {
    localStorage.removeItem("token");
}

export function checkExpire(){
    try {
        const jwt = localStorage.getItem("token");
        const user = jwt_decode(jwt);
        return user.exp;
    }catch(error){
        return null;
    }
}

export function getCurrentUser() {
    try {
        const jwt = localStorage.getItem("token");
        const user = jwt_decode(jwt);
        return user;
    }catch(error) {
        return null;
    }
}

export function loginWithJwt(jwt) {
    localStorage.setItem("token",jwt);
}

export function getJwt(){
    return localStorage.getItem("token");
}

export default {
    login, 
    logout,
    getCurrentUser,
    loginWithJwt,
    getJwt,
    checkExpire
};
