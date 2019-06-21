package ro.fortech.movietheater.service.interfaces;

import ro.fortech.movietheater.entity.Genre;

import java.util.List;
import java.util.Optional;

public interface IGenreService {
	
	List<Genre> getAllGenres();
	
	Genre addGenre(Genre genre);
	
	Genre deleteGenre(Long id);

	Optional<Genre> getGenreById(Long id);
}
