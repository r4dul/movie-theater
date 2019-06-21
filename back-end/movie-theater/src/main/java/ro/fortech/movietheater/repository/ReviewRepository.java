package ro.fortech.movietheater.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import ro.fortech.movietheater.entity.Actor;
import ro.fortech.movietheater.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long>, QuerydslPredicateExecutor<Actor> {
}
