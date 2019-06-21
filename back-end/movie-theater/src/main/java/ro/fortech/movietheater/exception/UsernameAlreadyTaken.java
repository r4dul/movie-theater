package ro.fortech.movietheater.exception;

public class UsernameAlreadyTaken extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = -8658304251442081837L;
	
	public UsernameAlreadyTaken() {
		super("Username already taken");
	}

}
