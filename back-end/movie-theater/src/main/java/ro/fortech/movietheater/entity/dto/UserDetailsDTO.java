package ro.fortech.movietheater.entity.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Lob;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDetailsDTO {

    private String username;

    private String password;

    private String name;

    private String email;

    private int age;

    private byte[] photo;

}
