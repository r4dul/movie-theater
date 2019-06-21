package ro.fortech.movietheater.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value= HttpStatus.BAD_REQUEST, reason="Invalid Password. Minimum 6 characters required.")
public class InvalidPasswordException extends RuntimeException {
    public InvalidPasswordException(){}
}
