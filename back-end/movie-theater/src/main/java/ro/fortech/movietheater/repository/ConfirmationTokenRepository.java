package ro.fortech.movietheater.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.fortech.movietheater.entity.ConfirmationToken;

public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationToken, String> {
    ConfirmationToken findByConfirmationToken(String confirmationToken);
}
