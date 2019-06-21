package ro.fortech.movietheater.service.interfaces;

import org.springframework.data.domain.Page;
import ro.fortech.movietheater.entity.Movie;
import ro.fortech.movietheater.entity.Review;
import ro.fortech.movietheater.entity.User;

import java.util.List;

public interface IReviewService {
    Review addReviewToMovie(Review review, Movie movie);
    List<Review> getMovieReviews(Movie movie);

}
