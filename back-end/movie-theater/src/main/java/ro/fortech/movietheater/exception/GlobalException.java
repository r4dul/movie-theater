package ro.fortech.movietheater.exception;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalException extends ResponseEntityExceptionHandler {

	@ExceptionHandler(NotFoundException.class)
	public ResponseEntity<?> handleNotFoundException( NotFoundException ex) throws IOException {
		Map<String, Object> body = new LinkedHashMap<String, Object>();
		HttpStatus status;
		body.put("timestamp", new Date());
		body.put("status", HttpStatus.NOT_FOUND.value());
		body.put("message", ex.getMessage());

		status = HttpStatus.NOT_FOUND;

		return new ResponseEntity<Object>(body, status);
	}


	@ExceptionHandler(UserInternalErrorException.class)
	public ResponseEntity<Object> springHandleUserInternalErrorException(HttpServletResponse response) throws IOException{

		Map<String, Object> body = new LinkedHashMap<String, Object>();
		HttpStatus status;
		body.put("timestamp", new Date());
		body.put("status", HttpStatus.BAD_REQUEST.value());
		body.put("message", "Error when adding to database");

		status = HttpStatus.BAD_REQUEST;

		return new ResponseEntity<Object>(body, status);
	}

	@ExceptionHandler(UsernameAlreadyTaken.class)
	public void springHandleUsernameTaken(HttpServletResponse response) throws IOException {
		response.sendError(HttpStatus.NOT_ACCEPTABLE.value());
	}


//	protected ResponseEntity<Object> handleMethodArgumentNotValid(UserNotFoundException ex, HttpHeaders headers,
//			HttpStatus status, WebRequest request) {
//
//		Map<String, Object> body = new LinkedHashMap<String, Object>();
//		body.put("timestamp", new Date());
//		body.put("status", status.value());
//
//		String errors = ex.getMessage();
//
//		body.put("errors", errors);
//
//		return new ResponseEntity<>(body, headers, status);
//	}

}
