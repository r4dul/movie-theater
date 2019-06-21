package ro.fortech.movietheater.exception;

public class UserInternalErrorException extends RuntimeException {
    public UserInternalErrorException(){}

    public UserInternalErrorException(String message) {
        super(message);
    }
}
