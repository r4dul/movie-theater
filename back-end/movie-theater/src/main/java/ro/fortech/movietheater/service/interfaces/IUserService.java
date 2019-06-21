package ro.fortech.movietheater.service.interfaces;

import org.springframework.http.ResponseEntity;
import ro.fortech.movietheater.entity.Movie;
import ro.fortech.movietheater.entity.User;
import ro.fortech.movietheater.entity.dto.UserDetailsDTO;

import java.util.List;

public interface IUserService {
	
	List<User> getAllUsers();

	User addUser(User user);

	User findUserById(Long id);

	User findUserByUsername(String username);
	
	void deleteUser(Long id);
	
	Movie addMovieToWishlist(User user,Long movieId);
	
	void deleteMovieFromWishlist(User user, Long movieId);

	void updateUser(User user);

	ResponseEntity<Object> getUserByIdTest(Long id);

	ResponseEntity<Object> addUserTest(User user);

	List<Movie> getAllMovies(Long id);
	
	
}
