package ro.fortech.movietheater.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value= HttpStatus.BAD_REQUEST, reason="Invalid Review Message. Minimum 5 characters required and maximum 255 allowed.")
public class InvalidReviewException extends RuntimeException{
}
