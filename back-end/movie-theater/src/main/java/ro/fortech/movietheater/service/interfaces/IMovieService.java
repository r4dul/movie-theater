package ro.fortech.movietheater.service.interfaces;

import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ro.fortech.movietheater.entity.Actor;
import ro.fortech.movietheater.entity.Genre;
import ro.fortech.movietheater.entity.Movie;

import java.util.List;

public interface IMovieService {

	Page<Movie> getAllMovies(Predicate predicate,Pageable pageable);

	List<Movie> getAllMoviesByWishList(String genre, Long id);
	
	Page<Movie> getAllMoviesByGenre(String genre, Pageable pageable);
	
	Page<Movie> getAllMoviesByTitle(String title, Pageable pageable);
	
	Page<Movie> getAllMoviesByActor(String actor,Pageable pageable);

	Page<Movie> getAllMoviesByTitleDSL(String title, Pageable pageable);
	
	List<Actor> getAllActorsFromMovie(Long movieId);
	
	List<Genre> getAllGenresFromMovie(Long movieId);
	
	Movie addMovie(Movie movie);
	
	void addRating(Long id, int rating);
	
	void deleteMovie(Long id);
	
	Movie updateMovie(Movie movie, Long id);
	
	Movie getMovieById(Long id);

	//Movie addListaFilme(List<Actor> movies,Long id);
	
	/*void addActor(Long id, Actor actor);
	
	void addActorById(Long movieId, Long actorId);
	
	void deleteActor(Long movieId, Long actorId);
	
	void deleteGenre(Long movieId, Long genreId);*/

	
	
	
	
	
}
