package ro.fortech.movietheater.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ro.fortech.movietheater.entity.Actor;
import ro.fortech.movietheater.exception.NotFoundException;
import ro.fortech.movietheater.exception.UserInternalErrorException;
import ro.fortech.movietheater.service.ActorService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/actors")
@CrossOrigin
public class ActorController {

	private static final Logger LOGGER = LoggerFactory.getLogger(ActorController.class);

	@Autowired
	private ActorService actorService;

	/**
	 * @GET - returns the actors
	 *
	 * @return List<Actor> A list of all the actors
	 */
	@GetMapping
	List<Actor> getAllActors(){
		List<Actor> actors = actorService.getAllActors();
		if(actors.isEmpty()){
			LOGGER.warn("There are 0 actors");
		}
		LOGGER.info("Got the list of all the actors");
		return actors;
	}

	/**
	 * POST - adds an actor
	 * ROLE_ADMIN or ROLE_USER is required to add an actor
	 * @status 400 Bad request || 401 Unauthorized || 201 Created
	 * @param actor - The actor object to be added
	 * @return The actor object that was added
	 */
	@PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
	@ResponseStatus(HttpStatus.CREATED)
	@PostMapping
	ResponseEntity<?> addActor(@RequestBody Actor actor) {
		return Optional.ofNullable(actorService.addActor(actor)).map(a -> {
					LOGGER.info("New actor was added");
					LOGGER.debug("Actor added: "+a);
					return new ResponseEntity<>(a,HttpStatus.CREATED);}).orElseThrow(() -> {
						LOGGER.error("Failed to add actor");
					return new UserInternalErrorException("Error adding actor to database");
		});
				}


	@PutMapping
	Actor updateActor(@RequestBody Actor actor){
		actorService.addActor(actor);
		LOGGER.info("Actor was updated");
		return actor;
	}

	/**
	 * DELETE - deletes an actor
	 * ROLE_ADMIN is required to delete an actor
	 * @status 401 Unauthorized || 404 Not Found || 200 OK
	 * @param id - the id of the actor to be deleted
	 *
	 */
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@DeleteMapping("/{id}")
	ResponseEntity<?> deleteActor(@PathVariable Long id) {

		return Optional.ofNullable(actorService.deleteActor(id))
				.map(a -> {LOGGER.info("Actor was deleted");
					LOGGER.debug("Actor with id= "+id+" was deleted");
				return new ResponseEntity<>(a,HttpStatus.OK);}).orElseThrow(() -> new NotFoundException("The actor was not found"));
	}


	/**
	 * GET get an actor by name
	 * @param name -  the name of the actor to be received
	 * @return a list of actors with names containing the name provided
	 */
	@GetMapping("/name/{name}")
	List<Actor> getActorByName(@PathVariable String name) {

		List<Actor> actors = actorService.getAllActorsByName(name);

		LOGGER.info("Got the list of all the actors with a specified name");

		if(actors.isEmpty()){
			LOGGER.warn("There are 0 actors named "+name);
		}
		return actors;
	}

	/**
	 * GET get the actor with the given id
	 * @param id - the id of the actor to be received
	 * @return the actor with the given id
	 */
	@GetMapping("/id/{id}")
	ResponseEntity<?> getActorById(@PathVariable Long id) {
		Actor actor = actorService.getActorById(id);

		return Optional.ofNullable(actor).map(a -> {
			LOGGER.info("The actor was found");
			return new ResponseEntity<>(a,HttpStatus.OK);}
		).orElseThrow(() -> {
			LOGGER.error("Actor with id "+id+" was not found");
			return new NotFoundException("The actor was not found");
		});


	}

}
