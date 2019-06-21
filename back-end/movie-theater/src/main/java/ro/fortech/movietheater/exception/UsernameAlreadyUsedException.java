package ro.fortech.movietheater.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "This username is already taken.")
public class UsernameAlreadyUsedException extends RuntimeException {
}
