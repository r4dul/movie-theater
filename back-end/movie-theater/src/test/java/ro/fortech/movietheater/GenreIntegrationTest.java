package ro.fortech.movietheater;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.transaction.AfterTransaction;
import ro.fortech.movietheater.entity.Genre;
import ro.fortech.movietheater.repository.GenreRepository;
import ro.fortech.movietheater.service.GenreService;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;

@RunWith(SpringRunner.class)
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class GenreIntegrationTest {

    @Autowired
    private GenreRepository genreRepository;

    @Autowired
    private EntityManager em;

    private GenreService genreService;

    List<Genre> finalGenre = new ArrayList<>();


/*    @Before
    public void setUp(){
        this.genreService = new GenreService(genreRepository,em);
    }*/


    @AfterTransaction
    public void dropDown(){
        genreRepository.deleteAll(finalGenre);
    }

    @Test
    public void shouldSaveAndFethGenreById(){
        Genre genre = new Genre();
        genre.setGenre("TestingGenre");

        genreService.addGenre(genre);
        finalGenre.add(genre);

        Optional<Genre> maybeGenre = genreService.getGenreById(genre.getId());

        assertThat(maybeGenre.isPresent(),is(true));
        assertThat(maybeGenre.get(),is(genre));
    }

    @Test
    public void shouldFetchAllGenres(){
        Genre genre = new Genre();
        genre.setGenre("TestingGenre");

        genreService.addGenre(genre);
        finalGenre.add(genre);


        List<Genre> genres = genreService.getAllGenres();

        assertThat(genres.size(),greaterThan(0));


    }

    @Test
    public void shouldDeleteGenre(){
        Genre genre = new Genre();
        genre.setGenre("TestingGenre");

        genreService.addGenre(genre);

        List<Genre> genres = genreService.getAllGenres();

        assertThat(genres.contains(genre),is(true));

        genreService.deleteGenre(genre.getId());

        genres = genreService.getAllGenres();

        assertThat(genres.contains(genre),is(false));
    }

}
