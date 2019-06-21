package ro.fortech.movietheater.service;

import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import ro.fortech.movietheater.entity.Actor;
import ro.fortech.movietheater.entity.QActor;
import ro.fortech.movietheater.entity.QMovie;
import ro.fortech.movietheater.repository.ActorRepository;
import ro.fortech.movietheater.service.interfaces.IActorService;

import javax.persistence.EntityManager;
import java.util.List;

@Service
public class ActorService implements IActorService {

	@Autowired
	private ActorRepository actorRepository;

	@Autowired
	private MovieService movieService;

	@Autowired
	private EntityManager em;

	@Override
	public List<Actor> getAllActors() {
		return actorRepository.findAll();
	}

	@PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
	@Override
	public Actor addActor(Actor actor) {
		return actorRepository.save(actor);
	}

	@Override
	public Actor getActorByName(String name) {
		return actorRepository.findByName(name).orElse(null);
	}

	@Override
	public Actor getActorById(Long id) {
		return actorRepository.findById(id).orElse(null);
	}

	@Override
	public List<Actor> getAllActorsByName(String name) {
		JPAQueryFactory queryFactory = new JPAQueryFactory(em);

		List<Actor> actors = queryFactory
				.from(QActor.actor)
				.select(QActor.actor)
				.where(QActor.actor.name.startsWithIgnoreCase(name))
				.fetch();

		return actors;
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@Override
	public Actor deleteActor(Long id) {
		JPAQueryFactory queryFactory = new JPAQueryFactory(em);

		return actorRepository.findById(id).map(a -> {
			queryFactory
					.from(QMovie.movie)
					.select(QMovie.movie)
					.where(QMovie.movie.actors.contains(a))
					.iterate()
					.forEachRemaining(m -> m.getActors().remove(a));
			actorRepository.delete(a);
			return a;
		}).orElse(null);

	}
}
