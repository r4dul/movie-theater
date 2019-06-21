package ro.fortech.movietheater.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.fortech.movietheater.entity.Movie;
import ro.fortech.movietheater.entity.Review;
import ro.fortech.movietheater.repository.MovieRepository;
import ro.fortech.movietheater.service.interfaces.IReviewService;

import java.util.List;

@Service
public class ReviewService implements IReviewService {

    @Autowired
    private MovieRepository movieRepository;

    public Review addReviewToMovie(Review review, Movie movie) {
        List<Review> reviews = movie.getReviews();
        reviews.add(review);
        movieRepository.flush();
        return review;
    }

    public List<Review> getMovieReviews(Movie movie) {
        return movie.getReviews();
    }
}
