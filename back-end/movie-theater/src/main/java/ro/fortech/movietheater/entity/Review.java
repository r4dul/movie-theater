package ro.fortech.movietheater.entity;


import lombok.Data;
import javax.persistence.*;


@Entity
@Table(name="review")
@Data
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="review_id")
    private Long id;

    @Column(name="user_id")
    private Long userId;

    @Column(name="review_message")
    private String reviewMessage;

}
