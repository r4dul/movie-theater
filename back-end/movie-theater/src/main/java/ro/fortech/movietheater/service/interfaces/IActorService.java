package ro.fortech.movietheater.service.interfaces;

import ro.fortech.movietheater.entity.Actor;

import java.util.List;

public interface IActorService {
	
	List<Actor> getAllActors();
	
	Actor addActor(Actor actor);
	
	Actor deleteActor(Long id);
	
	Actor getActorByName(String name);
	
	Actor getActorById(Long id);

	List<Actor> getAllActorsByName(String name);
	
	
	
	
	
}
