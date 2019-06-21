package ro.fortech.movietheater.entity.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ro.fortech.movietheater.entity.Actor;
import ro.fortech.movietheater.entity.Genre;
import ro.fortech.movietheater.entity.Movie;

import javax.persistence.Lob;
import java.io.Serializable;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovieDTO implements Serializable {

    private Long id;

    @Lob
    @JsonIgnore
    private byte[] photo;

    private String title;

    private int year;

    private String description;

    private double rating;

    private int noReviews;

    private List<Genre> genres;

    private List<Actor> actors;

    public MovieDTO(Movie movie){
        this.id = movie.getId();
        this.photo = movie.getPhoto();
        this.title = movie.getTitle();
        this.year = movie.getYear();
        this.rating = movie.getRating();
        this.noReviews = movie.getNoReviews();
        this.genres = movie.getGenres();
        this.actors = movie.getActors();
        this.description = movie.getDescription();
    }
}
