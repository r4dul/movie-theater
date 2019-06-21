package ro.fortech.movietheater.controller;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ro.fortech.movietheater.entity.*;
import ro.fortech.movietheater.exception.NotFoundException;
import ro.fortech.movietheater.repository.UserRepository;
import ro.fortech.movietheater.service.MovieService;

import javax.persistence.EntityManager;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;

//import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin
public class MovieController {

	private Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private EntityManager entityManager;


	@Autowired
	private MovieService movieService;

	@Autowired
	private UserRepository userRepository;

	@Value("${config.security.header}")
	private String tokenHeader;


	/**
	 * GET return a list of recommended movies
	 *
	 * @param request - HttpServletRequest to retrieve the token from the header.
	 * @param page - the page to be displayed
	 * @return
	 */
	//@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping("/recommended/")
	public Page<Movie> getWatchlist(HttpServletRequest request,@RequestParam(defaultValue = "0") int page,@RequestParam(defaultValue = "5") int size){
		User user = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());

/*		Claims claims = jwtTokenUtil.getClaimsFromToken(request.getHeader(tokenHeader));
		if (claims != null) {
			Long claimsId = Long.parseLong(claims.get("id").toString());
			return movieService.getAllMoviesByWatchlist(claimsId,page,size);
		}*/

		return null;
	}

	/**
	 *
	 * @param title - The search parameter.
	 * @param pageable - Abstract interface for pagination information.
	 * @return A paginated list of movies that match the search criteria.
	 */
	@GetMapping("/search/title/{title}")
	Page<Movie> searchMovies(@PathVariable String title, Pageable pageable) {
		BooleanBuilder booleanBuilder = new BooleanBuilder();
		if(title != null && !title.isEmpty()){
			booleanBuilder.and(QMovie.movie.title.startsWithIgnoreCase(title));
		}
		return movieService.getAllMovies(booleanBuilder.getValue(),pageable);
	}


	/**
	 *  GET - returns the movies.
	 * @param pageable - Abstract interface for pagination information.
	 * @return Page<Movie> A paginated sublist of movies. If the user is logged in, we return the movies sorted by his watchlist if there are any movies
	 * in the watchlist. If the user is not logged in or has no movies in the watchlist the movies are retrieved normally from db.
	 */
	@GetMapping
	Page<Movie> getAllMovies(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size, @RequestParam(name="title",required = false) String title, @RequestParam(name="year",required = false) Integer year, @RequestParam(name ="genre",required = false) String genre, Pageable pageable){

		BooleanBuilder booleanBuilder = new BooleanBuilder();


		if(title != null && !title.isEmpty()){
			booleanBuilder.and(QMovie.movie.title.startsWithIgnoreCase(title));
		}

		if(genre != null && !genre.isEmpty()){
			booleanBuilder.and(QMovie.movie.genres.any().genre.containsIgnoreCase(genre));
		}

		if(year != null && year != 0 && year > 0) {
			booleanBuilder.or(QMovie.movie.year.between(year-3,year+3));
		}

		User user = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());

		if (user == null) {
			System.out.println("got all ,movies without wishlist sorting");

			return movieService.getAllMovies(booleanBuilder.getValue(),pageable);
		}

		JPAQueryFactory queryFactory = new JPAQueryFactory(entityManager);
		List<Movie> moviesList = queryFactory.from(QMovie.movie).select(QMovie.movie).where(QMovie.movie.users.contains(user)).fetch();

		if (moviesList.size() < 1) {
			return movieService.getAllMovies(booleanBuilder.getValue(),pageable);
		}

		if(pageable.getSort()==Sort.unsorted()) {
			System.out.println("got all movies with wishlist sorting");
			return movieService.getAllMoviesByWatchlist(user.getId(), pageable);
		}
		else {
			return movieService.getAllMovies(booleanBuilder.getValue(),pageable);
		}
	}

	/**
	 *  GET - gets a movie by id.
	 * @param id - The movie id to be returned.
	 * @throws 404 MovieNotFoundException
	 * @status 404 Not Found || 200 OK
	 * @return The movie Entity
	 */
	@GetMapping("/{id}")
	ResponseEntity<?> getMovieById(@PathVariable Long id){
		Movie movie = movieService.getMovieById(id);
		if(movie==null){
			LOGGER.error("Movie with id "+id+" was not found");
		}else{
			LOGGER.info("Got the movie with id "+id);
		}
		return Optional.ofNullable(movie).map(m -> new ResponseEntity<>(m,HttpStatus.OK)).orElseThrow(() -> new NotFoundException("The movie was not found"));
	}

	/**
	 * DELETE - deletes a movie.
	 * ROLE_ADMIN is required to delete a movie
	 * @status 403 Forbidden if user doesn't have ROLE_ADMIN || 404 Not Found if there is no movie with that id || 200 OK
	 * @throws 404 MovieNotFoundException
	 * @param id - The id of the movie to be deleted.
	 */
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@DeleteMapping("/{id}")
	void deleteMovie(@PathVariable Long id) {
		movieService.deleteMovie(id);
		LOGGER.info("Movie with id "+id+" was deleted");
	}

	/**
	 * POST - adds a movie.
	 * ROLE_ADMIN is required to add a movie.
	 * @status 404 Forbidden || 201 Created.
	 * @param movie - The movie object to be added.
	 * @return The movie object that was added.
	 */
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	ResponseEntity<?> addMovie(@RequestBody Movie movie){
		return Optional.ofNullable(movieService.addMovie(movie)).map(m -> {
			LOGGER.info("A new movie was created");
			LOGGER.debug("Movie was added to database "+movie);
			return new ResponseEntity<>((Object)m, HttpStatus.CREATED);})
				.orElseThrow(() -> new NotFoundException("The movie was not found"));
	}

/*
    @PreAuthorize("hasRole('ROLE_ADMIN')")
	@PutMapping("/test/{id}")
	Movie listaFilme(@RequestBody List<Actor> movies,@PathVariable Long id){
		return movieService.addListaFilme(movies,id);
	}
*/

	/**
	 *  GET - returs a list of movies that corespond with the title
	 * @param title - The title of the movie. Title should be exact match for a Movie Entity to be returned.
	 * @throws 404 MovieNotFoundException
	 * @return - A list Movie Entities that match the title.
	 */
	@GetMapping("/title/{title}")
	Page<Movie> getMovieByTitle(@PathVariable String title, Pageable pageable){
		Page<Movie> movies = movieService.getAllMoviesByTitleDSL(title,pageable);
		if (movies.getTotalElements() == 0) {
			LOGGER.error("Movie was not found");
			throw new NotFoundException("The movie was not found");
		}
		LOGGER.info("Movie was found by title");
		return movies;
	}

	/**
	 * GET - gets a list of movies filetered by actor name.
	 * @throws 404 MovieNotFoundException
	 * @param name - The name of the actor
	 * @return - A list of movies that contain the actor.
	 */
	@GetMapping("/actor/{name}")
	Page<Movie> getMovieByActor(@PathVariable String name,Pageable pageable){
		Page<Movie> movies = movieService.getAllMoviesByActor(name, pageable);
		if (movies.getTotalElements() == 0) {
			LOGGER.error("Movie was not found");
			throw new NotFoundException("The movie was not found");
		}
		LOGGER.info("Movie was found by the name of the actor");
		return movies;
	}


	/**
	 * GET - gets a list of movies filtered by 'genre' param.
	 * @param genre - The movie genre
	 * @param request - HttpServletRequest to retrieve the token from the header so we can retrieve the user_id
	 * @param pageable - Abstract interface for pagination information.
	 * If the user is logged in we filter the movies using the movies that are in his wishlist.
	 * If the user is not logged in we display the movies in the order that were added in database.
	 * @return Page<Movie> A paginated list of movies filtered by 'genre" param
	 */
	@GetMapping("/genre/{genre}")
	Page<Movie> getMovieByGenre(@PathVariable String genre, Pageable pageable, HttpServletRequest request){

		User user = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
		if (user != null) {
			if (user.getMovies().size() < 1) {
				return movieService.getAllMoviesByGenre(genre, pageable);
			}
			List<Movie> movies = movieService.getAllMoviesByWishList(genre, user.getId());
			int start = (int) pageable.getOffset();
			int end = (start + pageable.getPageSize()) > movies.size() ? movies.size() : (start + pageable.getPageSize());
			Page<Movie> moviePages = new PageImpl<>(movies.subList(start, end), pageable, movies.size());
			return moviePages;
		}

/*		Claims claims = jwtTokenUtil.getClaimsFromToken(request.getHeader(tokenHeader));
		if (claims != null) {
			Long claimsId = Long.parseLong(claims.get("id").toString());
			List<Movie> movies = movieService.getAllMoviesByWishList(genre, claimsId);
			int start = (int) pageable.getOffset();
			int end = (start + pageable.getPageSize()) > movies.size() ? movies.size() : (start + pageable.getPageSize());
			Page<Movie> moviePages = new PageImpl<>(movies.subList(start, end), pageable, movies.size());
			return moviePages;
		}*/
		return movieService.getAllMoviesByGenre(genre, pageable);
	}

	/**
	 * PUT - adds a rating to a movie.
	 * @status 401 Unauthorized if the user is not logged in.
	 * @param movieId - The id of the movie.
	 * @param score - The score that the user sets for the movie.
	 */
	@PutMapping("/{movieId}/{score}")
	void addRating(@PathVariable Long movieId, @PathVariable int score) {
		movieService.addRating(movieId, score);
		LOGGER.info("Rating was added");
	}

	/**
	 * Put - updates a movie.
	 * ROLE_ADMIN is required to update a movie.
	 * @status 401 Unauthorized if the user is not logged in.
	 * @param movie - The movie object that needs to be updated. movie_id is required to update an existing movie.
	 * If movie id is not provided, a new movie is created.
	 * @param id - the id of the movie that needs to be updated.
	 * @return
	 */
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PutMapping("/{id}")
	Movie updateMovie(@RequestBody Movie movie,@PathVariable Long id) {
		LOGGER.info("Movie was updated");
		return movieService.updateMovie(movie, id);
	}

	/**
	 * GET - gets a list with all actors of a specific movie.
	 * @param movieId - the movie id.
	 * @return A list with all actors
	 */
	@GetMapping("/{movieId}/actors")
	List<Actor> getAllActorsFromMovie(@PathVariable Long movieId){
		return movieService.getAllActorsFromMovie(movieId);
	}

	@GetMapping("/{movieId}/genres")
	List<Genre> getAllGenresFromMovie(@PathVariable Long movieId){
		return movieService.getAllGenresFromMovie(movieId);
	}

	/*@DeleteMapping("/{movieId}/actors/{actorId}")
	void deleteActor(@PathVariable Long movieId, @PathVariable Long actorId) {
		movieService.deleteActor(movieId, actorId);
	}
	@PutMapping("/{movieId}/actors")
	void addActorToMovie(@RequestBody Actor actor, @PathVariable Long movieId) {
		movieService.addActor(movieId, actor);
	}
	@PutMapping("/{movieId}/actors/{actorId}")
	void addExistingActorToMovie(@PathVariable Long movieId, @PathVariable Long actorId) {
		movieService.addActorById(movieId, actorId);
	}*/
	/*@PutMapping("/{movieId}/genres/{genreId}")
	void addGenreToMovie(@PathVariable Long movieId, @PathVariable Long genreId) {
		movieService.addGenreToMovie(movieId,genreId);
	}
	@DeleteMapping("/{movieId}/genres/{genreId}")
	void deleteGenreFromMovie(@PathVariable Long movieId,@PathVariable Long genreId) {
		movieService.deleteGenre(movieId, genreId);
	}
	*/
}