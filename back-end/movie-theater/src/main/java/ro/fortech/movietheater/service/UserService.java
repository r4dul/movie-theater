package ro.fortech.movietheater.service;

import com.querydsl.jpa.impl.JPAQueryFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ro.fortech.movietheater.entity.*;
import ro.fortech.movietheater.entity.dto.UserDTO;
import ro.fortech.movietheater.exception.NotFoundException;
import ro.fortech.movietheater.exception.UsernameAlreadyTaken;
import ro.fortech.movietheater.repository.MovieRepository;
import ro.fortech.movietheater.repository.ReviewRepository;
import ro.fortech.movietheater.repository.UserRepository;
import ro.fortech.movietheater.securityConfig.JwtUser;
import ro.fortech.movietheater.service.interfaces.IUserService;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements IUserService, UserDetailsService {
	private static Logger LOOGER = LoggerFactory.getLogger(UserService.class);

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private MovieService movieService;

	@Autowired
	private MovieRepository movieRepository;

	@Autowired
	ReviewRepository reviewRepository;

	@Autowired
	EntityManager em;

	@Override
	public User addUser(User user) {
		if(userRepository.findByUsername(user.getUsername())== null) {

			userRepository.save(user);
			return user;
		}else {
			throw new UsernameAlreadyTaken();
		}
	}

	@Override
	public User findUserById(Long id){
		return userRepository.findUserById(id);
	}

	@Override
	public User findUserByUsername(String username) {
		return userRepository.findByUsername(username);
	}

	@Override
	public JwtUser loadUserByUsername(String userName) throws UsernameNotFoundException {

		User user = userRepository.findByUsername(userName);

		if (user != null) {
			return new JwtUser(user);
		}
		return null;
	}

	@PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
	public JwtUser findUser(String userName) {

		User user = userRepository.findByUsername(userName);
		if (user != null) {
			return new JwtUser(user);
		}
		return null;
	}


	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public List<JwtUser> findAll() {

		List<User> users = userRepository.findAll();
		List<JwtUser> jwtUsers = new ArrayList<>();

		for (User user : users) {
			jwtUsers.add(new JwtUser(user));
		}
		return jwtUsers;
	}

	@Override
	public void deleteUser(Long id) {
			JPAQueryFactory queryFactory = new JPAQueryFactory(em);
			queryFactory
					.from(QReview.review)
					.select(QReview.review.id)
					.where(QReview.review.userId.eq(id))
					.fetch().iterator()
					.forEachRemaining(reviewId ->
									reviewRepository.deleteById(reviewId)
						);
			userRepository.deleteById(id);
			LOOGER.info("User was deleted.");
	}

	@Override
	public List<User> getAllUsers() {
		List<User> users = userRepository.findAll();

		if(users.isEmpty()){
			LOOGER.warn("There are 0 users");
		}

		LOOGER.info("Got all the users");
		return users;
	}


	public User getUserById(Long id) {
		return userRepository.findById(id).orElseThrow(() -> new NotFoundException("User was not found"));
	}


	@Override
	public Movie addMovieToWishlist(User user, Long movieId) {

		Movie movie = movieService.getMovieById(movieId);

		if(movie == null){

			LOOGER.debug("Movie was not found. Class: UserService, Method: addMovieToWishlist");

			throw new NotFoundException("Movie was not found");
		}

		user.getMovies().add(movie);

		userRepository.save(user);

		return movie;

		//LOOGER.info("Movie was added to watchlist");
	}

	//@PreAuthorize("hasRole('ROLE_USER')")
	public void deleteMovieFromWishlist(User user, Long movieId) {

		Movie movie = movieService.getMovieById(movieId);
		if(movie == null){

			LOOGER.debug("Movie was not found. Class: UserService, Method: deleteMovieFromWishlist");

			throw new NotFoundException("Movie was not found");
		}

		user.getMovies().remove(movie);

		userRepository.save(user);

		//LOOGER.info("Movie deleted successfully from the watchlist");
	}

	@Override
	public void updateUser(User user) {
			userRepository.save(user);
	}

	@Override
	public ResponseEntity<Object> getUserByIdTest(Long id) {
		User user = userRepository.findById(id).orElse(null);
        //System.out.println(user);
		return Optional.ofNullable(user)
				.map(u -> new ResponseEntity<>((Object)new UserDTO(u.getId(),u.getUsername(),u.getName(),u.getEmail(),u.getAge(),u.getMovies(), u.getPhoto(), u.getAuthorities()), HttpStatus.OK))
				.orElseThrow(() -> new NotFoundException("User was not found"));
	}

	@Override
	public ResponseEntity<Object> addUserTest(User usert) {
		User user = new User(usert);
		return Optional.ofNullable(userRepository.save(user))
				.map( u -> new ResponseEntity<>((Object)u,HttpStatus.CREATED))
				.orElse(ResponseEntity.badRequest().body(null));
	}

	@Override
	public List<Movie> getAllMovies(Long id) {

		User user = getUserById(id);
		List<Movie> users = user.getMovies();
		return users;
	}

	public double avarageYear(Long id){

		JPAQueryFactory queryFactory = new JPAQueryFactory(em);

		User user = userRepository.findById(id).get();

		Double hu = queryFactory.from(QMovie.movie).where(QMovie.movie.users.contains(user)).select(QMovie.movie.year.avg()).fetchFirst();

		return hu;
	}

	public double avarageRating(Long id){

		JPAQueryFactory queryFactory = new JPAQueryFactory(em);

		User user = userRepository.findById(id).get();

		Double hu = queryFactory.from(QMovie.movie).where(QMovie.movie.users.contains(user)).select(QMovie.movie.rating.avg()).fetchFirst();

		return hu;
	}

}
