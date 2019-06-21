package ro.fortech.movietheater.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ro.fortech.movietheater.entity.Authority;
import ro.fortech.movietheater.entity.Movie;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long id;

    private String username;

    private String name;

    private String email;

    private int age;

    private List<Movie> movies;

    private byte[] photo;

    private List<Authority> authorities;

}
