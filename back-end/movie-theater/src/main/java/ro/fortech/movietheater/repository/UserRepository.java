package ro.fortech.movietheater.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.fortech.movietheater.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	User findByUsername(String username);

	User findUserById(Long id);
	User findByEmailIgnoreCase(String email);
	User findByUsernameIgnoreCase(String username);

}
