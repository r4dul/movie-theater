package ro.fortech.movietheater.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;


@Entity
public class Authority implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Long id;

    @Enumerated(EnumType.STRING)
    private AuthorityType authorityType;

    @ManyToMany(mappedBy = "authorities", fetch = FetchType.LAZY)
    //@JsonBackReference
    @JsonIgnore
    private List<User> users;

    public Authority() {
    }


    public Long getId() {
        return id;
    }

    public AuthorityType getAuthorityType() {
        return authorityType;
    }

    public void setAuthorityType(AuthorityType authorityType) {
        this.authorityType = authorityType;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }
}
