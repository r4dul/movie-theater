package ro.fortech.movietheater.service;

import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import ro.fortech.movietheater.entity.Genre;
import ro.fortech.movietheater.entity.QMovie;
import ro.fortech.movietheater.repository.GenreRepository;
import ro.fortech.movietheater.service.interfaces.IGenreService;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

@Service
public class GenreService implements IGenreService{

	@Autowired
	 private GenreRepository genreRepository;
	
	@Autowired
	private MovieService movieService;

	@Autowired
	EntityManager em;
	
	
	@Override
	public Optional<Genre> getGenreById(Long id) {
		
		return genreRepository.findById(id);
	}

	@Override
	public List<Genre> getAllGenres() {
		
		return genreRepository.findAll();
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	public Genre addGenre(Genre genre) {
		return genreRepository.save(genre);
		
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	public Genre deleteGenre(Long id) {
		JPAQueryFactory queryFactory = new JPAQueryFactory(em);

		return genreRepository.findById(id).map(g -> {
			queryFactory
					.from(QMovie.movie)
					.select(QMovie.movie)
					.where(QMovie.movie.genres.contains(g))
					.iterate()
					.forEachRemaining(m -> m.getGenres().remove(g));
			genreRepository.delete(g);
			return g;
		}).orElse(null);
	}

}
