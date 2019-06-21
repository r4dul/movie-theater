package ro.fortech.movietheater.repository;


import com.querydsl.core.BooleanBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;
import ro.fortech.movietheater.entity.Movie;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long>, QuerydslPredicateExecutor<Movie> {

	Movie findMovieById(Long id);

	Page<Movie> findByTitle(String title, Pageable pageable);
	
	Page<Movie> findByActorsName(String name, Pageable pageable);

	Page<Movie> findByGenresGenre(String genre, Pageable pageable);



}
