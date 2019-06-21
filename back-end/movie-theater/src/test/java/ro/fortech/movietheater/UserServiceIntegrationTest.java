package ro.fortech.movietheater;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.transaction.AfterTransaction;
import ro.fortech.movietheater.entity.Movie;
import ro.fortech.movietheater.entity.User;
import ro.fortech.movietheater.repository.MovieRepository;
import ro.fortech.movietheater.repository.UserRepository;
import ro.fortech.movietheater.service.UserService;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.greaterThan;
import static org.junit.Assert.assertThat;

@RunWith(SpringRunner.class)
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class UserServiceIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private EntityManager em;

    private UserService userServiceInj;

    private List<User> finalUsers = new ArrayList<>();
    private Movie finalMovie = new Movie();

/*    @Before
    public void setUp(){
        this.userServiceInj = new UserService(userRepository,em,movieRepository);
    }*/

    @AfterTransaction
    public void dropAll(){
        userRepository.deleteAll(finalUsers);
        movieRepository.delete(finalMovie);

    }

    @Test
    public void shouldSaveAndFetchUserById(){
        User user = new User();
        user.setUsername("TestingUsername");

        userServiceInj.addUser(user);
        finalUsers.add(user);

        User maybeUser = userServiceInj.findUserById(user.getId());

        assertThat(maybeUser,is(user));
    }

    @Test
    public void shouldFetchAllUsers(){
        User user = new User();
        user.setUsername("TestingUsername");

        userServiceInj.addUser(user);
        finalUsers.add(user);

        List<User> users = userServiceInj.getAllUsers();

        assertThat(users.size(),greaterThan(0));
    }

    @Test
    public void shouldAddMovieToWishListThenDeleteIt(){
        List<Movie> movies = new ArrayList<>();
        User user = new User();
        user.setUsername("TestingUsername");
        user.setMovies(new ArrayList<>());

        userServiceInj.addUser(user);
        finalUsers.add(user);

        Movie movie = new Movie();
        movie.setTitle("TestingTitle");
        movieRepository.save(movie);
        finalMovie = movie;

/*        userServiceInj.addMovieToWishlist(user.getId(),movie.getId());
        movies = userServiceInj.getAllMovies(user.getId());

        assertThat(movies.size(),greaterThan(0));
        assertThat(movies.contains(movie),is(true));

        userServiceInj.deleteMovieFromWishlist(user.getId(),movie.getId());
        movies = userServiceInj.getAllMovies(user.getId());

        assertThat(movies.size(),is(0));
        assertThat(movies.contains(movie),is(false));*/



    }

    @Test
    public void shouldAddUserThenDeleteIt(){
        User user = new User();
        user.setUsername("TestingUsername");

        userServiceInj.addUser(user);

        List<User> users = userServiceInj.getAllUsers();

        assertThat(users.size(),greaterThan(0));
        assertThat(users.contains(user),is(true));

        userServiceInj.deleteUser(user.getId());

        users = userServiceInj.getAllUsers();

        assertThat(users.contains(user),is(false));
    }

    @Test
    public void shoudlAddUserAndReturnAvarageYearAndRating(){
        Movie movie1 = new Movie();
        Movie movie2 = new Movie();

        movie1.setYear(2002);
        movie2.setYear(2004);

        movie1.setRating(3);
        movie2.setRating(5);

        User user = new User();
        user.setUsername("TestingUsername");

        userServiceInj.addUser(user);
        finalUsers.add(user);



        List<Movie> movies = new ArrayList<>();
        movies.add(movie1);
        movies.add(movie2);

        movieRepository.saveAll(movies);

        user.setMovies(movies);

/*
        double avgYear = userServiceInj.averageYear(user.getId());
        double avgRating = userServiceInj.averageRating(user.getId());

        assertThat(avgYear,is(2003.0));
        assertThat(avgRating,is(4.0));

        movieRepository.deleteAll(movies);
*/




    } }


//    @Test
//    public void shouldSaveAndFetchUserById(){
//        User user = new User();
//        user.setUsername("TestingUsername");
//
//        userServiceInj.addUser(user);
//        finalUsers.add(user);
//
//        User maybeUser = userServiceInj.findUserById(user.getId());
//
//        assertThat(maybeUser,is(user));
//    }
//
//    @Test
//    public void shouldFetchAllUsers(){
//        User user = new User();
//        user.setUsername("TestingUsername");
//
//        userServiceInj.addUser(user);
//        finalUsers.add(user);
//
//        List<User> users = userServiceInj.getAllUsers();
//
//        assertThat(users.size(),greaterThan(0));
//    }
//
//    @Test
//    public void shouldAddMovieToWishListThenDeleteIt(){
//        List<Movie> movies = new ArrayList<>();
//        User user = new User();
//        user.setUsername("TestingUsername");
//        user.setMovies(new ArrayList<>());
//
//        userServiceInj.addUser(user);
//        finalUsers.add(user);
//
//        Movie movie = new Movie();
//        movie.setTitle("TestingTitle");
//        movieRepository.save(movie);
//        finalMovie = movie;
//
//        userServiceInj.addMovieToWishlist(user.getId(),movie.getId());
//        movies = userServiceInj.getAllMovies(user.getId());
//
//        assertThat(movies.size(),greaterThan(0));
//        assertThat(movies.contains(movie),is(true));
//
//        userServiceInj.deleteMovieFromWishlist(user.getId(),movie.getId());
//        movies = userServiceInj.getAllMovies(user.getId());
//
//        assertThat(movies.size(),is(0));
//        assertThat(movies.contains(movie),is(false));
//
//
//
//    }
//
//    @Test
//    public void shouldAddUserThenDeleteIt(){
//        User user = new User();
//        user.setUsername("TestingUsername");
//
//        userServiceInj.addUser(user);
//
//        List<User> users = userServiceInj.getAllUsers();
//
//        assertThat(users.size(),greaterThan(0));
//        assertThat(users.contains(user),is(true));
//
//        userServiceInj.deleteUser(user.getId());
//
//        users = userServiceInj.getAllUsers();
//
//        assertThat(users.contains(user),is(false));
//    }
//
//    @Test
//    public void shoudlAddUserAndReturnAvarageYearAndRating(){
//        Movie movie1 = new Movie();
//        Movie movie2 = new Movie();
//
//        movie1.setYear(2002);
//        movie2.setYear(2004);
//
//        movie1.setRating(3);
//        movie2.setRating(5);
//
//        User user = new User();
//        user.setUsername("TestingUsername");
//
//        userServiceInj.addUser(user);
//        finalUsers.add(user);
//
//
//
//        List<Movie> movies = new ArrayList<>();
//        movies.add(movie1);
//        movies.add(movie2);
//
//        movieRepository.saveAll(movies);
//
//        user.setMovies(movies);
//
//        double avgYear = userServiceInj.averageYear(user.getId());
//        double avgRating = userServiceInj.averageRating(user.getId());
//
//        assertThat(avgYear,is(2003.0));
//        assertThat(avgRating,is(4.0));
//
//        movieRepository.deleteAll(movies);
//
//
//
//
//    }
//
////    @Test
////    public void shouldSaveAndFetchUserByUsername(){
////        User user = new User();
////        user.setUsername("TestingUsername");
////
////        userServiceInj.addUser(user);
////        finalUsers.add(user);
////
////        JwtUser maybeUser = userServiceInj.loadUserByUsername("TestingUsername");
////
////        assertThat(maybeUser.getUsername(),is("TestingUsername"));
////
////    }
//}
