package ro.fortech.movietheater.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.NoArgsConstructor;
import ro.fortech.movietheater.entity.dto.MovieDTO;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name="movie")
@NoArgsConstructor
public class Movie {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="movie_id")
	private Long id;

	@Lob
	private byte[] photo;
	
	//@NotEmpty(message="Title is mandatory")
	private String title;
	
	//@NotNull
	//@Min(1900)
	private int year;
	
	private String description;
	
	//@Min(1)
	//@Max(10)
	private double rating;
	
	@Column(name="no_reviews")
	private int noReviews;
	

	@JsonIgnore
	@ManyToMany(mappedBy="movies")
	private List<User> users;
	
	
	@ManyToMany(cascade = {
			CascadeType.MERGE
			})
	@JoinTable(name="movie_has_genre", joinColumns= {@JoinColumn(name="movie_id")},
	inverseJoinColumns= {@JoinColumn(name="genre_id")})
	private List<Genre> genres;

	
	@ManyToMany(cascade = {
			CascadeType.MERGE})
	@JoinTable(name="movie_has_actor", joinColumns= {@JoinColumn(name="movie_id")},
	inverseJoinColumns= {@JoinColumn(name="actor_id")})
	private List<Actor> actors;

	@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
	@JoinColumn(name = "movie_id")
	private List<Review> reviews;

	public Movie(MovieDTO movieDTO){
		this.id = movieDTO.getId();
		this.photo = movieDTO.getPhoto();
		this.actors = movieDTO.getActors();
		this.genres = movieDTO.getGenres();
		this.noReviews=movieDTO.getNoReviews();
		this.rating = movieDTO.getRating();
		this.description = movieDTO.getDescription();
		this.title= movieDTO.getTitle();
		this.year=movieDTO.getYear();
	}

	public List<String> getMovieGenresStringList() {
	    List<String> genres = new ArrayList<>();
	    this.getGenres().stream().forEach(genre -> {
            genres.add(genre.getGenre());
        });
	    return genres;
    }

	
}
