package ro.fortech.movietheater.controller;


import org.apache.tomcat.util.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import ro.fortech.movietheater.entity.*;
import ro.fortech.movietheater.entity.dto.UserDTO;
import ro.fortech.movietheater.exception.*;
import ro.fortech.movietheater.repository.ConfirmationTokenRepository;
import ro.fortech.movietheater.repository.UserRepository;
import ro.fortech.movietheater.securityConfig.JwtTokenUtil;
import ro.fortech.movietheater.service.EmailSenderService;
import ro.fortech.movietheater.service.UserService;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

import static ro.fortech.movietheater.entity.AuthorityType.ROLE_USER;

@RestController
@RequestMapping("api/users")
@CrossOrigin
public class UserController {

	private Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Value("${config.security.header}")
	private String tokenHeader;

	@Autowired
	private UserService userService;


	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ConfirmationTokenRepository confirmationTokenRepository;

	@Autowired
	private EmailSenderService emailSenderService;

	/**
	 * GET - gets all users. Requires ROLE_ADMIN
	 * @return 401 unauthorized || Status.OK 200 && all the users in database.
	 */

	@GetMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	List<User> getAllUsers(){
		List<User> users = userService.getAllUsers();
		List<UserDTO> usersDTO = new ArrayList<>();
		users.forEach(u -> {
			usersDTO.add(new UserDTO(u.getId(),u.getUsername(),u.getName(),u.getEmail(),u.getAge(),u.getMovies(), u.getPhoto(), u.getAuthorities()));
		});
		LOGGER.info("Got the list of all users");
		return users;
	}

	@GetMapping("/email")
	Boolean findUserByEmail(@RequestParam("email") String email) {
		User user = userRepository.findByEmailIgnoreCase(email);
		if (user == null) {
			return false;
		}
		return true;
	}

	@GetMapping("/user")
	Boolean findUserByUsername(@RequestParam("username") String username) {
		User user = userRepository.findByUsernameIgnoreCase(username);
		if (user == null) {
			return false;
		}
		return true;
	}

	/**
	 * POST - register the user
	 * @param user User Details DTO
	 *  A verification email is send to the user's email for account confirmation.
	 * @return 201/created Status if success.
	 * @throws InvalidPasswordException 400 (Bad Request) if the password is too short minimum 6 characters required.
	 * @throws EmailAlreadyUsedException 400 (Bad Request) if there email is already in database.
	 * @throws UsernameAlreadyUsedException 400 (Bad Request) if the username is already taken.
	 */
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	ResponseEntity<Object> addUserTest(@RequestBody User user) {
		if (!checkPasswordLength(user.getPassword())) {
			LOGGER.error("Invalid password");
			throw new InvalidPasswordException();
		}
		if (user.getAge() < 11) {
			return new ResponseEntity<>("User should be at least 12 years old to create an account", HttpStatus.BAD_REQUEST);
			//throw new UserInternalErrorException("You must be at least 12 years old to create an account.");
		}

		User testUser = userRepository.findByEmailIgnoreCase(user.getEmail());
		if (testUser != null) {
			LOGGER.error("Email already exists");
			return new ResponseEntity<>("Another account is registered under this email.", HttpStatus.BAD_REQUEST);
			//throw new EmailAlreadyUsedException();
		}
		testUser = userRepository.findByUsernameIgnoreCase(user.getUsername());
		if (testUser != null) {
			LOGGER.error("username already used");
			return new ResponseEntity<>("The username is already taken", HttpStatus.BAD_REQUEST);
			//throw new UsernameAlreadyUsedException();
		}
		LOGGER.info("A new user was added");
		LOGGER.debug("The user was added: "+user);

		User newUser = new User(user);
		System.out.println(newUser.getAuthorities());
		Authority auth = new Authority();
		auth.setAuthorityType(ROLE_USER);
		newUser.getAuthorities().add(auth);

		User userCreated = userRepository.save(newUser);
		System.out.println((userCreated.getAuthorities()));

		if (userCreated == null) {
			LOGGER.error("Error while trying to add a new user to db.");
		}
		ConfirmationToken confirmationToken = new ConfirmationToken(userCreated);
		if (confirmationToken == null) {
			LOGGER.error("Error while creating confirmation token");
		}
		confirmationTokenRepository.save(confirmationToken);
		SimpleMailMessage mailMessage = new SimpleMailMessage();
		mailMessage.setTo(user.getEmail());
		mailMessage.setSubject("Complete your registration");
		mailMessage.setFrom("movie.theater@localhost.com");
		mailMessage.setReplyTo("movie.theater@localhost.com");
		mailMessage.setText("To confirm your Movie Theater account, please click on the following link: " + "http://localhost:3000/verifyEmail?token=" + confirmationToken.getConfirmationToken());

		try {
			emailSenderService.sendEmail(mailMessage);
			LOGGER.info("Verification email was sent to: " + user.getEmail());
		} catch (MailException ex) {
			ex.getStackTrace();
			LOGGER.error("An email to: " + user.getEmail() + " could not be sent");
		}

		return new ResponseEntity<>("The user was created.", HttpStatus.CREATED);
	}
	Boolean checkPasswordLength(String password) {
		if (password.length() <= 5) {
			return false;
		}
		return true;
	}

	/**
	 * @GET request
	 * @param confirmationToken - the token parameter that is found in the url.
	 * @return ResponseEntity with ok status if account was confirmed. bad_request if something went wrong(wrong url or token)
	 */
	@GetMapping("/confirm-account")
	public ResponseEntity<Object> confirmUserAccount(@RequestParam("token") String confirmationToken) {
		ConfirmationToken token = confirmationTokenRepository.findByConfirmationToken(confirmationToken);
		if (token != null) {
			User user = userRepository.findByEmailIgnoreCase(token.getUser().getEmail());
			user.setEnabled(true);
			userRepository.save(user);
			confirmationTokenRepository.delete(token);
			LOGGER.info("User account " + user.getUsername() + " was confirmed using the email address: " + user.getEmail());
			LOGGER.info("Confirmation row was deleted from confirmation_token table.");
			SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
			simpleMailMessage.setTo(user.getEmail());
			simpleMailMessage.setSubject("Your account on Movie Theater is now active! ");
			simpleMailMessage.setReplyTo("movie.theater@localhost.com");
			simpleMailMessage.setText("Congratulations! You account is now active and you may login.");

			try {
				emailSenderService.sendEmail(simpleMailMessage);
				LOGGER.info("A welcoming email was sent to: " + user.getEmail());
			} catch(MailException ex) {
				ex.getStackTrace();
				LOGGER.error("Clould not send an email to: " + user.getEmail());
			}
			return new ResponseEntity<>("Your account was confirmed!", HttpStatus.OK);
		}
		return new ResponseEntity<>("Token or url was invalid!", HttpStatus.BAD_REQUEST);
	}

	/**
	 * PUT - updates an existing user(user_id is needed, if not provided, creates new user)
	 * Requires ROLE_ADMIN
	 * @param user - The user to be added.
	 * @return Status 200 OK || 403 Forbidden
	 */
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PutMapping
	void updateUser(@RequestBody User user){
		LOGGER.info("User" + user.getUsername() + "was updated");
		userService.updateUser(user);
	}

	/**
	 * @POST
	 * This method changes the user's photo
	 * @param newUser - the new User who's photo needs to be updated
	 */

	@PostMapping("/photo")
	void changeUserPhoto(@RequestBody User newUser) {
		User user = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
		//System.out.println("new user id" + newUser.getId() + " user id " + user.getId());
		if (newUser.getId() != user.getId()) {
			throw new UserOperationNotAllowedException();
		}
		//System.out.println("new user photo" + newUser.getPhoto());
		user.setPhoto(newUser.getPhoto());
		LOGGER.info(user.getUsername() + " updated the photo.");
		userService.updateUser(user);
	}
	// user can update only his user
/*	@PutMapping
	ResponseEntity<Object> updateUser(@RequestBody User user, HttpServletRequest request){
		Claims claims = jwtTokenUtil.getClaimsFromToken(request.getHeader(tokenHeader));
		Long claimsId = Long.parseLong(claims.get("id").toString());

		return Optional.ofNullable(userService.updateUser(user, claimsId))
				.map( u -> new ResponseEntity<>((Object)u,HttpStatus.OK))
				.orElseThrow(() -> new UserInternalErrorException("Modifying another user is not allowed."));
	}*/

	/**
	 *
	 * @param id - the user_id that needs to be deleted.
	 * Requires ROLE_ADMIN
	 * @return Status 200 OK || 403 Forbidden
	 */

	@DeleteMapping("/{id}")
	void deleteUser(@PathVariable Long id) {
		User user = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
		System.out.println("the user id" + user.getId() + "autorities" + " the long ID" + id);
		user.getAuthorities().forEach(authority -> System.out.println("authority type" + authority.getAuthorityType())
		);
		if (user.getId() == id) {
			System.out.println("delete statement");
			userService.deleteUser(id);
			LOGGER.info(user.getUsername() + " was deleted");
			return ;
		} else {
			user.getAuthorities().forEach(authority -> {
				if (authority.getAuthorityType().equals(AuthorityType.ROLE_ADMIN)) {
					userService.deleteUser(id);
					LOGGER.info(user.getUsername() + " was deleted");
					return ;
				}
			});
		}
		throw new UserOperationNotAllowedException();
	}

/*	@DeleteMapping("/{id}")
	void deleteUser(@PathVariable Long id, HttpServletRequest request) {
		Claims claims = jwtTokenUtil.getClaimsFromToken(request.getHeader(tokenHeader));
		Long claimsId = Long.parseLong(claims.get("id").toString());
		if (id == claimsId)
			userService.deleteUser(id);
		else throw new UserInternalErrorException("Cannot delete another user");
	}*/

	/**
	 *
	 * @param id - the user id that should be returned.
	 *	No ROLES required.
	 * @return Status 200 OK status && the User Entity.
	 */
	@GetMapping("/{id}")
	ResponseEntity<Object> getUserByIdTest(@PathVariable Long id) {
		return userService.getUserByIdTest(id);
	}

	/**
	 * PUT - adds a movie to the wishlist.
	 * User must be logged in.
	 *
	 * @param userId - the id of the user who adds a movie to wishlist.
	 * @param movieId - the id of the movies who is to be added to the wishlist.
	 * @throws UserOperationNotAllowedException 400 Bad Request if user tries to add a movie for another user.
	 * @return Status 200 OK || 401 unauthorized if user is not logged in
	 */

	@PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
	@PutMapping("/{userId}/{movieId}")
	Movie addMovieToWishlist(@PathVariable Long userId, @PathVariable Long movieId, HttpServletRequest request) {

		//System.out.println("secoruty context" + SecurityContextHolder.getContext().getAuthentication().getName());

		User user = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());

		if (user == null) {
			LOGGER.debug("User was not found. Class: UserController, Method: addMovieToWishlist");
			throw new UsernameNotFoundException("User was not found.");
		}

		if (userId != user.getId()) {
			throw new UserOperationNotAllowedException();
		}

		user.getMovies().stream().forEach(movie -> {
			if (movie.getId() == movieId) {
				throw new MovieAlreadyAddedException();
			}
		});

		LOGGER.info("Movie was added to the watchlist");
		return userService.addMovieToWishlist(user, movieId);

	}


	/**
	 * DELETE - adds a movie to the wishlist.
	 * User must be logged in.
	 *
	 * @param userId - the id of the user who removes a movie from wishlist.
	 * @param movieId - the id of the movies who is to be removed from the wishlist.
	 * @throws UserOperationNotAllowedException 400 Bad Request if user tries to remove a movie for another user.
	 * @return Status 200 OK || 401 unauthorized if user is not logged in
	 */
	@PreAuthorize("hasRole('ROLE_USER') or hasRole('ADMIN')")
	@DeleteMapping("/{userId}/{movieId}")
	void deleteMovieFromWishlist(@PathVariable Long userId, @PathVariable Long movieId, HttpServletRequest request) {

		User user = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());

		if (user == null) {
			LOGGER.debug("User was not found. Class: UserService, Method: deleteMovieFromWishlist");
			throw new UsernameNotFoundException("User was not found.");
		}

		if (userId != user.getId()) {
			throw new UserOperationNotAllowedException();
		}

		LOGGER.info("Movie was deleted from the watchlist");
		userService.deleteMovieFromWishlist(user, movieId);
	}


	@PreAuthorize("hasRole('ROLE_USER') or hasRole('ADMIN')")
	@GetMapping("/{userId}/movies")
	Page<Movie> getAllMovies(@PathVariable Long userId, Pageable pageable){
		List<Movie> movies =  userService.getAllMovies(userId);
		int start = (int) pageable.getOffset();
		int end = (start + pageable.getPageSize()) > movies.size() ? movies.size() : (start + pageable.getPageSize());
		Page<Movie> moviePages = new PageImpl<>(movies.subList(start, end), pageable, movies.size());
		return moviePages;
	}





	/*@ResponseStatus(HttpStatus.CREATED)
	@PostMapping
	User addUser(@RequestBody User user) {
		userService.addUser(user);
		return user;
	}*/
	/*
	@GetMapping("/{id}")
	User getUserById(@PathVariable Long id) {
		User user = userService.getUserById(id);

		return userService.getUserById(id);

	}
*/
	/*@user can update only his userMapping
	User updateUser(@RequestBody User user){
		userService.updateUser(user);
		return user;
	}*/
}
