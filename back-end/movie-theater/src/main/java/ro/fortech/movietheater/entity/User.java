package ro.fortech.movietheater.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import ro.fortech.movietheater.entity.dto.UserDetailsDTO;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import static ro.fortech.movietheater.entity.AuthorityType.ROLE_USER;


@Entity
@Table(name="user")
@NoArgsConstructor
public @Data class User implements Serializable {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="user_id")
	private Long id;

	@Lob
	private byte[] photo;
	
	//@NotEmpty(message="Username is mandatory")
	private String username;
	
	//@NotEmpty(message="Password is mandatory")
	private String password;
	
	//@NotEmpty(message="Name is mandatory")
	private String name;
	
	//@NotEmpty(message="Email is mandatory")
	//@Email
	private String email;
	
	//@Min(16)
	//@Max(99)
	private int age;

	@ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@JoinTable(name = "user_authority",
			joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "user_id"),
			inverseJoinColumns = @JoinColumn(name = "authority_id", referencedColumnName = "id"))

	//@JsonManagedReference
	private List<Authority> authorities;

	private boolean isEnabled;


	@ManyToMany(cascade=CascadeType.REMOVE)
	@JoinTable(name="user_has_movie", joinColumns= {@JoinColumn(name="user_id")},
	inverseJoinColumns= {@JoinColumn(name="movie_id")})
	private List<Movie> movies;

	public User(UserDetailsDTO userDetailsDTO){
		this.username = userDetailsDTO.getUsername();
		this.password = this.getPasswordEncoder().encode(userDetailsDTO.getPassword());
		this.name = userDetailsDTO.getName();
		this.email = userDetailsDTO.getEmail();
		this.age = userDetailsDTO.getAge();
		this.photo = userDetailsDTO.getPhoto();
	}

	private BCryptPasswordEncoder getPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	public User(User user) {

		this.authorities = new ArrayList<>();

		this.email = user.getEmail();
		this.name = user.getName();
		this.age = user.getAge();
		this.id = user.getId();
		this.password = this.getPasswordEncoder().encode(user.getPassword());
		this.username = user.getUsername();
//		this.authorities=user.getAuthorities();
		this.photo = user.getPhoto();
	}
}
