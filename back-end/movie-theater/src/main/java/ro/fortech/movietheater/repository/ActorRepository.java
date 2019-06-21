package ro.fortech.movietheater.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;
import ro.fortech.movietheater.entity.Actor;

import java.util.Optional;

@Repository
public interface ActorRepository extends JpaRepository<Actor, Long>, QuerydslPredicateExecutor<Actor> {
	
	Optional<Actor> findByName(String name);
	

}
