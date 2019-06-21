package ro.fortech.movietheater.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import java.util.List;


@Entity
@Table(name="genre")
public @Data class Genre {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="genre_id")
	private Long id;


	private String genre;
	
	
	@JsonIgnore
	@ManyToMany(mappedBy="genres",fetch = FetchType.LAZY)
	private List<Movie> movies;

}
