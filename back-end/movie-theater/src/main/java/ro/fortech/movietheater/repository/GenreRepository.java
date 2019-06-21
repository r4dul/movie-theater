package ro.fortech.movietheater.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.fortech.movietheater.entity.Genre;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {

}
