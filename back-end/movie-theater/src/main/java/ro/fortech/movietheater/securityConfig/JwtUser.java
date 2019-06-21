package ro.fortech.movietheater.securityConfig;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import ro.fortech.movietheater.entity.Authority;
import ro.fortech.movietheater.entity.User;

import java.util.ArrayList;
import java.util.List;

public class JwtUser implements UserDetails {

    @JsonIgnore
    private Long id;

    private String username;

    @JsonIgnore
    private String password;

    //@JsonIgnore
    private String name;

    //@JsonIgnore
    private String email;

    private int age;

    private List<GrantedAuthority> authorities;

    public JwtUser(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.password = user.getPassword();
        this.name = user.getName();
        this.email = user.getEmail();
        this.age = user.getAge();
        this.authorities = authoritiesToGrantedAuthorities(user.getAuthorities());
    }


    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public List<GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(List<GrantedAuthority> authorities) {
        this.authorities = authorities;
    }

    private List<GrantedAuthority> authoritiesToGrantedAuthorities(List<Authority> authorities) {

        List<GrantedAuthority> grantedAuthorities = new ArrayList<>();

        for (Authority authority : authorities) {
            grantedAuthorities.add(new SimpleGrantedAuthority(authority.getAuthorityType().name()));
        }
        return grantedAuthorities;
    }
}
