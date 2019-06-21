package ro.fortech.movietheater.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ro.fortech.movietheater.entity.Genre;
import ro.fortech.movietheater.exception.NotFoundException;
import ro.fortech.movietheater.exception.UserInternalErrorException;
import ro.fortech.movietheater.service.GenreService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/genres")
@CrossOrigin
public class GenreController {

	private static Logger LOGGER = LoggerFactory.getLogger(GenreController.class);

	@Autowired
	private GenreService genreService;

	/**
	 * GET get all the genres
	 * @status 200 OK
	 * @return a list containing all the genres
	 */
	@GetMapping
	List<Genre> getAllGenres(){
		return genreService.getAllGenres();
	}

	/**
	 * POST add a genre
	 * @param genre the genre to be added
	 * @status 500 Internal Error || 201 Created
	 * @return the genre that has been added
	 */
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseStatus(HttpStatus.CREATED)
	@PostMapping
	ResponseEntity<?> addGenre(@RequestBody Genre genre) {

		return Optional.ofNullable(genreService.addGenre(genre)).map( g -> {
			LOGGER.info("Added a new genre");
			LOGGER.debug("Added a new genre: "+g);
			return new ResponseEntity<>(g,HttpStatus.CREATED);

		}).orElseThrow(() -> {
			LOGGER.error("Failed to add genre");
			return new UserInternalErrorException("Error adding genre to the database");
		});

	}

	/**
	 * DELETE deletes a genre
	 * @param id the id of the genre to be deleted
	 */
	@DeleteMapping("/{id}")
	void deleteGenre(@PathVariable Long id) {

		genreService.deleteGenre(id);
		LOGGER.info("A genre was deleted");
	}
	
	@GetMapping("/id/{id}")
	Genre getGenreById(@PathVariable Long id) {
		return genreService.getGenreById(id).orElseThrow(()-> new NotFoundException("Genre was not found"));
	}
}
