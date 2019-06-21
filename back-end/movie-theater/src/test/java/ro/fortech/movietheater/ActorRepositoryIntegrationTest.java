package ro.fortech.movietheater;


import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.transaction.AfterTransaction;
import ro.fortech.movietheater.entity.Actor;
import ro.fortech.movietheater.repository.ActorRepository;
import ro.fortech.movietheater.service.ActorService;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;
import static org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace.NONE;

@RunWith(SpringRunner.class)
@DataJpaTest
@AutoConfigureTestDatabase(replace = NONE)
final public class ActorRepositoryIntegrationTest {

    @Autowired
    private ActorRepository actorRepository;

    @Autowired
    private EntityManager em ;

    private ActorService actorService;

    private List<Actor> finalActors = new ArrayList<>();


/*    @Before
    public void setUp(){
        this.actorService = new ActorService(actorRepository,em);
    }*/


    @AfterTransaction
    public void dropAll(){
        actorRepository.deleteAll(finalActors);
    }

    @Test
    public void shouldGetAllActors() {
        Actor actor = new Actor();
        actor.setName("TestingName");

        Actor actor1 = actorService.addActor(actor);
        finalActors.add(actor1);

        List<Actor> actors = actorService.getAllActors();

        assertThat(actors.size(),is(2));
    }


    @Test
    public void shouldSaveAndFetchActorByName(){
        Actor actor = new Actor();

        actor.setName("TestingName");

        actorService.addActor(actor);
        finalActors.add(actor);

        Actor maybeActor = actorService.getActorByName("TestingName");

        assertThat(maybeActor,is(actor));
    }

    @Test
    public void shouldGetActorsByName(){
        Actor actor = new Actor();
        actor.setName("TestingName1");

        Actor actor2 = new Actor();
        actor2.setName("TestingName2");

        actorService.addActor(actor);
        actorService.addActor(actor2);
        finalActors.add(actor);
        finalActors.add(actor2);

        List<Actor> actors = new ArrayList<>();

        actors = actorService.getAllActorsByName("TestingName");

        assertThat(actors.size(),is(2));
        assertThat(actors.contains(actor),is(true));

    }

    @Test
    public void shouldSaveAndFetchActorById(){
        Actor actor = new Actor();
        actor.setName("TestingName");

        actorService.addActor(actor);
        finalActors.add(actor);

        Actor maybeActor = actorService.getActorById(actor.getId());

        assertThat(maybeActor,is(actor));
    }

    @Test
    public void shouldSaveAndDeleteActor(){
        Actor actor = new Actor();
        actor.setName("TestingName");

        actorService.addActor(actor);

        List<Actor> actors = actorService.getAllActors();

        assertThat(actors.contains(actor),is(true));

        actorService.deleteActor(actor.getId());

        actors = actorService.getAllActors();

        assertThat(actors.contains(actor),is(false));
    }

//    @Test
//    public void testStuff(){
//        QActor a = QActor.actor;
//        JPAQuery<Actor> query = new JPAQuery<>(em);
//        List<Actor> actors = query
//                .from(a)
//                .select(a)
//                .where(a.name.startsWithIgnoreCase("stefan"))
//                .fetch();
//
//        assertThat(actors.size(),is(2));
//    }


}
