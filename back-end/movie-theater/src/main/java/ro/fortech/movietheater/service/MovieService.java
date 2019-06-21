package ro.fortech.movietheater.service;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import ro.fortech.movietheater.entity.*;
import ro.fortech.movietheater.exception.NotFoundException;
import ro.fortech.movietheater.repository.MovieRepository;
import ro.fortech.movietheater.repository.ReviewRepository;
import ro.fortech.movietheater.service.interfaces.IMovieService;

import javax.persistence.EntityManager;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MovieService implements IMovieService {

	private static Logger LOGGER = LoggerFactory.getLogger(MovieService.class);

	@Autowired
	private MovieRepository movieRepository;

	@Autowired
	private ActorService actorService;

	@Autowired
	private GenreService genreService;

	@Autowired
	private UserService userService;

	@Autowired
	private ReviewRepository reviewRepository;

	@Autowired
	EntityManager em;

	@Override
	public Page<Movie> getAllMovies(Predicate predicate,Pageable pageable) {
		return movieRepository.findAll(predicate,pageable);
	}

	public Page<Movie> getAllMoviesByWatchlist(Long id, Pageable pageable) {

		JPAQueryFactory queryFactory = new JPAQueryFactory(em);
		//BooleanBuilder booleanBuilder = new BooleanBuilder();

		User user = userService.getUserById(id);

		double avgYear = userService.avarageYear(id);

		double avgRating = userService.avarageRating(id);

		List<Movie> moviesList = queryFactory.from(QMovie.movie).select(QMovie.movie).where(QMovie.movie.users.contains(user)).fetch();

		HashSet<Genre> genres = new HashSet<>();
		moviesList.forEach(m -> genres.addAll(m.getGenres()));

		List<Movie> filteredMovies = queryFactory.from(QMovie.movie).select(QMovie.movie)
				.where(QMovie.movie.genres.any().in(genres))
				.select(QMovie.movie).where(QMovie.movie.year.between(avgYear-4,avgYear+4))
				.select(QMovie.movie).where(QMovie.movie.rating.between(avgRating-2,avgRating+2))
				.fetch();

		filteredMovies.addAll(queryFactory.from(QMovie.movie).select(QMovie.movie).where(QMovie.movie.notIn(filteredMovies)).fetch());

		int start = (int) pageable.getOffset();
		int end = (start + pageable.getPageSize()) > filteredMovies.size() ? filteredMovies.size() : (start + pageable.getPageSize());
		Page<Movie> moviePages = new PageImpl<>(filteredMovies.subList(start, end), pageable, filteredMovies.size());

/*		booleanBuilder
				.and(QMovie.movie.genres.any().in(genres))
				.and(QMovie.movie.year.between(avgYear-3,avgYear+3))
				.and(QMovie.movie.rating.between(avgRating-1,avgRating+1));
		Page<Movie> movies = movieRepository.findAll(booleanBuilder.getValue(), pageable);
		System.out.println(movies);*/


		return moviePages;
		//return movieRepository.findAll(booleanBuilder.getValue(),pageable);
	}


	@Override
	public List<Movie> getAllMoviesByWishList(String genre, Long id){
		List<Movie> movies = movieRepository.findAll();
		User user = userService.findUserById(id);

		List<Movie> wishlistMovies = user.getMovies();
		List<Integer> years = new ArrayList<>();

		List<Double> ratings = wishlistMovies.stream().map(movie -> {
			years.add(movie.getYear());
			return movie.getRating();
		}).collect((Collectors.toList()));

		int yearsAverage = years.stream().reduce(0, (year1, year2) -> year1 + year2) / years.size();

		double ratingAverage = ratings.stream().reduce(0.0, (rating1, rating2) -> rating1 + rating2) / ratings.size();
		Set<String> wishlistGenres = new HashSet<>();

		wishlistMovies.stream().forEach(movie -> {
			List<Genre> genres = movie.getGenres();
			for(Genre g : genres)
				wishlistGenres.add(g.getGenre());
		});
		List<Movie> newMovieList = new ArrayList<>();
		if (genre == null){
			movies.forEach(movie -> {
				if (CollectionUtils.containsAny(wishlistGenres, movie.getMovieGenresStringList()) || movie.getYear()  >= yearsAverage - 3 && movie.getYear() <= yearsAverage + 3
						|| movie.getRating() >= ratingAverage - 1 &&  movie.getRating() <= ratingAverage + 1){
					newMovieList.add(0, movie);
				}
				else {
					newMovieList.add(movie);
				}
			});
		}
		else {
			movies.forEach(movie -> {
				List<Genre> genres = movie.getGenres();
				genres.forEach(g -> {
				    if (g.getGenre().equals(genre)){
				        if (movie.getYear()  >= yearsAverage - 3 && movie.getYear() <= yearsAverage + 3
                                || movie.getRating() >= ratingAverage - 1 &&  movie.getRating() <= ratingAverage + 1){
                            newMovieList.add(0, movie);
                        } else {
                            newMovieList.add(movie);
                        }
                    }
                });
			});
		}
		return newMovieList;
	}


	@Override
	public Page<Movie> getAllMoviesByGenre(String genre, Pageable pageable) {
		return movieRepository.findByGenresGenre(genre, pageable);
	}

	@Override
	public Page<Movie> getAllMoviesByTitle(String title,Pageable pageable) {
		return movieRepository.findByTitle(title,pageable);
	}

	@Override
	public Page<Movie> getAllMoviesByActor(String actor,Pageable pageable) {
		return movieRepository.findByActorsName(actor,pageable);
	}

	@Override
	public Page<Movie> getAllMoviesByTitleDSL(String title, Pageable pageable) {

		return movieRepository.findAll(QMovie.movie.title.startsWith(title), pageable);
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	public Movie addMovie(Movie movie) {
		return movieRepository.save(movie);

	}

	@Override
	public void addRating(Long id, int score) {
		Movie movie = movieRepository.findById(id).orElse(null);
		if (movie == null) {
			LOGGER.debug("Movie was not found when adding rating. The id: " + id);
			throw new NotFoundException("The movie was not found");
		}
		movie.setRating((movie.getRating() * movie.getNoReviews() + score) / (movie.getNoReviews() + 1));
		movie.setNoReviews(movie.getNoReviews() + 1);
		movieRepository.save(movie);
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	public void deleteMovie(Long id) {

		JPAQueryFactory queryFactory = new JPAQueryFactory(em);

		movieRepository.findById(id).map(m ->{
			queryFactory
					.from(QUser.user)
					.select(QUser.user)
					.where(QUser.user.movies.contains(m))
					.iterate()
					.forEachRemaining(u -> u.getMovies().remove(m));
			List<Review> reviews = m.getReviews();
			reviews.forEach(review -> reviewRepository.deleteById(review.getId()));
			movieRepository.delete(m);
			return m;
		}).orElse(null);


	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	public Movie updateMovie(Movie movie, Long id) {
		Movie findMovie = movieRepository.findMovieById(id);
		if (findMovie == null) {
			LOGGER.debug("Movie with id "+id +" was not found. Class: MovieService, Method: updateMovie ");
			throw new NotFoundException("The movie was not found");
		}
		else {
			movieRepository.save(movie);
		}
		return movieRepository.save(movie);
	}

	@Override
	public Movie getMovieById(Long id) {
		Movie movie = movieRepository.findById(id).orElse(null);
		return movie;
	}

/*	@Override
	public Movie addListaFilme(List<Actor> movies,Long id) {
		Movie movie = movieRepository.findById(id).get();

		movie.getActors().addAll(movies);
		movieRepository.save(movie);

		return movie ;
	}*/

	/*@Override
	public void addActor(Long id, Actor actor) {
		Movie movie = this.getMovieById(id).orElseThrow(() -> new MovieNotFoundException());
		movie.getActors().add(actor);
		movieRepository.save(movie);
	}

	@Override
	public void addActorById(Long movieId, Long actorId) {
		Movie movie = this.getMovieById(movieId).orElseThrow(() -> new MovieNotFoundException());
		Actor actor = actorService.getActorById(actorId);
		movie.getActors().add(actor);
		movieRepository.save(movie);

	}*/


	@Override
	public List<Actor> getAllActorsFromMovie(Long movieId) {
		Movie movie = movieRepository.findById(movieId).orElse(null);
		if (movie == null) {
			LOGGER.debug("Movie with id "+movieId+" was not found. Class: MovieService, Method: getAllActorsFromMovie");
			throw new NotFoundException("Movie was not found");
		}
		return movie.getActors();
	}

	@Override
	public List<Genre> getAllGenresFromMovie(Long movieId) {
		Movie movie = movieRepository.findById(movieId).orElse(null);
		if (movie == null) {
			LOGGER.debug("Movie with id "+movieId+" was not found. Class: MovieService, Method: getAllGenresFromMovie");
			throw new NotFoundException("Movie was not found");
		}
		return movie.getGenres();
	}

	/*public void addGenreToMovie(Long movieId, Long genreId) {
		Genre genre = genreService.getGenreById(genreId);
		Movie movie = this.getMovieById(movieId);
		movie.getGenres().add(genre);
		movieRepository.save(movie);
	}

	@Override
	public void deleteActor(Long movieId, Long actorId) {
		Movie movie = this.getMovieById(movieId);
		Actor actor = actorService.getActorById(actorId);

		movie.getActors().remove(actor);
		movieRepository.save(movie);

	}*/

	/*@Override
	public void deleteGenre(Long movieId, Long genreId) {
		Genre genre = genreService.getGenreById(genreId);
		Movie movie = this.getMovieById(movieId);

		movie.getGenres().remove(genre);
		movieRepository.save(movie);

	}

	@Override
	public List<MovieDTO> getAllMoviesTest() {
		List<Movie> movies = movieRepository.findAll();
		List<MovieDTO> moviesDTO = new ArrayList<>();

		movies.forEach(m  -> {
			moviesDTO.add(new MovieDTO(m));
		});

		return moviesDTO;
	}

	@Override
	public Movie addMovieTest(MovieDetailsDTO movieDetailsDTO) {
		Movie movie = new Movie(movieDetailsDTO);
		return movieRepository.save(movie);
	}

	@Override
	public MovieDTO getMovieByIdTest(Long id) {
		Movie movie = movieRepository.findById(id).orElse(null);
		return Optional.ofNullable(movie).map(m -> new ResponseEntity<>((Object)new MovieDTO(m),HttpStatus.CREATED)).orElseThrow(() ->new MovieNotFoundException(id));


	}
*/

}
