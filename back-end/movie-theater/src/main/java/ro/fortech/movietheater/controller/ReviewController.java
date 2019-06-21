package ro.fortech.movietheater.controller;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ro.fortech.movietheater.entity.Movie;
import ro.fortech.movietheater.entity.Review;
import ro.fortech.movietheater.entity.User;
import ro.fortech.movietheater.exception.InvalidReviewException;
import ro.fortech.movietheater.exception.NotFoundException;
import ro.fortech.movietheater.exception.UserOperationNotAllowedException;
import ro.fortech.movietheater.repository.MovieRepository;
import ro.fortech.movietheater.repository.ReviewRepository;
import ro.fortech.movietheater.repository.UserRepository;
import ro.fortech.movietheater.service.ReviewService;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin
public class ReviewController {

    private Logger LOGGER = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    /**
     *
     * @param review - Movie review to be added.
     * @param movieId - The movie id to which the review is added
     * @throws NotFoundException if the movie with movieId is not found in DB
     * @throws UserOperationNotAllowedException if the user is not logged in
     * @return The review added
     */
    @PostMapping("/{movieId}")
    public Review addReviewToMovie(@RequestBody Review review, @PathVariable Long movieId) {
        User user = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        Movie movie = movieRepository.findMovieById(movieId);

        if (user == null) {
            throw new UserOperationNotAllowedException();
        }

        if (movie == null) {
            throw new NotFoundException("The movie that you are trying to add a review to was not found.");
        }
        if (review.getReviewMessage().length() < 4 || review.getReviewMessage().length() > 255) {
            LOGGER.error("Review is too long or too short. Must be between 5 and 255");
            throw new InvalidReviewException();
        }
        review.setUserId(user.getId());
        return reviewService.addReviewToMovie(review, movie);
    }


    @GetMapping("/{movieId}")
    public Page<Review> getMovieReviews(@PathVariable Long movieId, Pageable pageable) {

        Movie movie = movieRepository.findMovieById(movieId);

        if (movie == null) {
            throw new NotFoundException("Movie not found.");
        }
        List<Review> reviews = reviewService.getMovieReviews(movie);

        int start = (int) pageable.getOffset();
        int end = (start + pageable.getPageSize()) > reviews.size() ? reviews.size() : (start + pageable.getPageSize());
        Page<Review> reviewPages = new PageImpl<>(reviews.subList(start, end), pageable, reviews.size());
        return reviewPages;
    }

    @GetMapping
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public void removeReview(@PathVariable Long id) {
        reviewRepository.deleteById(id);
    }

}
