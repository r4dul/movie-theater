package ro.fortech.movietheater;

import lombok.Data;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.transaction.AfterTransaction;
import ro.fortech.movietheater.entity.Actor;
import ro.fortech.movietheater.entity.Genre;
import ro.fortech.movietheater.entity.Movie;
import ro.fortech.movietheater.entity.User;
import ro.fortech.movietheater.repository.ActorRepository;
import ro.fortech.movietheater.repository.GenreRepository;
import ro.fortech.movietheater.repository.MovieRepository;
import ro.fortech.movietheater.repository.UserRepository;
import ro.fortech.movietheater.service.MovieService;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.core.Is.is;

@RunWith(SpringRunner.class)
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class MovieServiceIntegrationTest {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private GenreRepository genreRepository;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private ActorRepository actorRepository;

    private MovieService movieService;

    private List<Movie> finalMovie = new ArrayList<>();
    private List<Genre> finalGenre = new ArrayList<>();
    private List<Actor> finalActor = new ArrayList<>();


/*    @Before
    public void setUp(){
        this.movieService = new MovieService(movieRepository,entityManager);
    }*/


    @AfterTransaction
    public void dropDown(){
        movieRepository.deleteAll(finalMovie);
        genreRepository.deleteAll(finalGenre);
        actorRepository.deleteAll(finalActor);
    }

    @Test
    public void shouldReturnAllMovies(){
        Movie movie = new Movie();
        movie.setTitle("TestingMovieTitle");

        movieRepository.save(movie);
        finalMovie.add(movie);

        Page<Movie> movies = movieService.getAllMovies(null, PageRequest.of(0,5));

        assertThat(movies.getTotalElements(),greaterThan(0L));

    }

    @Test
    public void shouldReturnMoviesByWatchlist(){
        User user = new User();
        user.setUsername("TestingUser");

        Movie movie = new Movie();
    }

    @Test
    public void shouldReturnAllMoviesByGenre(){
        Genre genre = new Genre();
        genre.setGenre("TestingGenre");
        genreRepository.save(genre);

        List<Genre> genres = new ArrayList<>();
        genres.add(genre);
        finalGenre.add(genre);


        Movie movie = new Movie();
        movie.setGenres(genres);
        movieRepository.save(movie);
        finalMovie.add(movie);

        Page<Movie> movies = movieService.getAllMoviesByGenre("TestingGenre",PageRequest.of(0,5));

        assertThat(movies.getTotalElements(),is(1L));
        assertThat(movies.getContent().contains(movie),is(true));
    }

    @Test
    public void shouldReturnAllMoviesByTitleDSL(){
        Movie movie = new Movie();
        movie.setTitle("TestingTitle");
        movieRepository.save(movie);
        finalMovie.add(movie);

        Movie movie2 = new Movie();
        movie2.setTitle("TestingTitleNumberTwo");
        movieRepository.save(movie2);
        finalMovie.add(movie2);

        Page<Movie> movies = movieService.getAllMoviesByTitleDSL("Testingt", Pageable.unpaged());

        assertThat(movies.getTotalElements(),is(2L));
        assertThat(movies.getContent().contains(movie),is(true));
        assertThat(movies.getContent().get(0).getTitle(),is("TestingTitle"));
        assertThat(movies.getContent().contains(movie2),is(true));
        assertThat(movies.getContent().get(1).getTitle(),is("TestingTitleNumberTwo"));

    }

    @Test
    public void shouldReturnAllMoviesByActor(){
        Actor actor = new Actor();
        actor.setName("TestingActor");
        actorRepository.save(actor);
        List<Actor> actors = new ArrayList<>();
        actors.add(actor);
        finalActor.add(actor);

        Movie movie = new Movie();
        movie.setTitle("TestingTitle");
        movie.setActors(actors);
        movieRepository.save(movie);
        finalMovie.add(movie);

        Page<Movie> movies = movieService.getAllMoviesByActor("TestingActor",Pageable.unpaged());

        assertThat(movies.getTotalElements(),is(1L));
        assertThat(movies.getContent().contains(movie),is(true));
        assertThat(movies.getContent().get(0).getActors().get(0).getName(),is("TestingActor"));

    }

    @Test
    public void shouldAddAndFetchMovie(){
        Movie movie = new Movie();
        movie.setTitle("TestingTitle");
        finalMovie.add(movie);

        movieService.addMovie(movie);

        Movie maybeMovie = movieService.getMovieById(movie.getId());

        assertThat(maybeMovie,is(movie));




    }

    @Test
    public void shouldAddRating(){
        Movie movie = new Movie();
        movie.setTitle("TestingTitle");
        movie.setRating(6);
        movie.setNoReviews(1);
        movieRepository.save(movie);
        finalMovie.add(movie);

        movieService.addRating(movie.getId(),8);

        Movie ratedMovie = movieRepository.findMovieById(movie.getId());

        assertThat(ratedMovie.getRating(),is(7.0));
        assertThat(ratedMovie.getNoReviews(),is(2));
    }

    @Test
    public void shouldDeleteMovie(){
        Movie movie = new Movie();
        movie.setTitle("TestingTitle");
        movieRepository.save(movie);
        finalMovie.add(movie);

        Page<Movie> movies = movieService.getAllMovies(null,Pageable.unpaged());

        assertThat(movies.getContent().contains(movie),is(true));
        movieService.deleteMovie(movie.getId());

        movies = movieService.getAllMovies(null,Pageable.unpaged());

        assertThat(movies.getContent().contains(movie),is(false));
    }

    @Test
    public void shouldGetAllActorsFromMovie(){
        Actor actor = new Actor();
        actor.setName("TestingActor");
        actorRepository.save(actor);

        Actor actor2 = new Actor();
        actor.setName("TestingActor2");
        actorRepository.save(actor2);

        List<Actor> actors = new ArrayList<>();
        actors.add(actor);
        actors.add(actor2);
        finalActor.add(actor);
        finalActor.add(actor2);

        Movie movie = new Movie();
        movie.setTitle("TestingTitle");
        movie.setActors(actors);
        movieRepository.save(movie);
        finalMovie.add(movie);

        List<Actor> actorList = movieService.getAllActorsFromMovie(movie.getId());

        assertThat(actorList.size(),is(2));
        assertThat(actorList.contains(actor),is(true));
        assertThat(actorList.contains(actor2),is(true));
    }

    @Test
    public void shouldGetAllGenresFromMovie(){
        Genre genre = new Genre();
        genre.setGenre("TestingGenre");
        genreRepository.save(genre);

        Genre genre2 = new Genre();
        genre2.setGenre("TestingGenre2");
        genreRepository.save(genre2);

        List<Genre> genres = new ArrayList<>();
        genres.add(genre);
        genres.add(genre2);
        finalGenre.add(genre);
        finalGenre.add(genre2);

        Movie movie = new Movie();
        movie.setTitle("TestingTitle");
        movie.setGenres(genres);
        movieRepository.save(movie);
        finalMovie.add(movie);

        List<Genre> genreList = movieService.getAllGenresFromMovie(movie.getId());

        assertThat(genreList.size(),is(2));
        assertThat(genreList.contains(genre),is(true));
        assertThat(genreList.contains(genre2),is(true));
    }






}
