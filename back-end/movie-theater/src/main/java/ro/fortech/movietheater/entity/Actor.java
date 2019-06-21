package ro.fortech.movietheater.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.util.List;


@Entity
@Table(name="actor")
public @Data class Actor {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="actor_id")
	private Long id;
	
	@NotEmpty(message="Name is mandatory")
	private String name;
	
	@JsonIgnore
	@ManyToMany(mappedBy="actors")
	private List<Movie> movies;

}
