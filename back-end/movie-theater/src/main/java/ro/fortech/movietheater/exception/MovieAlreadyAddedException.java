package ro.fortech.movietheater.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value= HttpStatus.BAD_REQUEST, reason="The movie was already added to your watchlist.")
public class MovieAlreadyAddedException extends RuntimeException{
    public MovieAlreadyAddedException(){}
}
