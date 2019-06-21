package ro.fortech.movietheater;

import com.google.common.collect.Maps;
import com.querydsl.jpa.JPQLTemplates;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import ro.fortech.movietheater.entity.Actor;
import ro.fortech.movietheater.entity.Movie;
import ro.fortech.movietheater.entity.QMovie;

import javax.inject.Provider;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertNotNull;

public class QueryTest {

    private EntityManagerFactory factoryMock;

    private EntityManager entityManagerMock;

    private JPAQueryFactory queryFactory;

    private JPAQueryFactory queryFactory2;

    private JPAQueryFactory queryFactory3;

    private Map<String, Object> properties = Maps.newHashMap();

    @Before
    public void setUp(){
        factoryMock = Mockito.mock(EntityManagerFactory.class);
        entityManagerMock = Mockito.mock(EntityManager.class);
        Provider<EntityManager> provider = new Provider<EntityManager>() {
            @Override
            public EntityManager get() {
                return entityManagerMock;
            }
        };

        queryFactory = new JPAQueryFactory(JPQLTemplates.DEFAULT,provider);
        queryFactory2 = queryFactory;
        queryFactory3 = new JPAQueryFactory(provider);
    }

    @Test
    public void query() {
        assertNotNull(queryFactory.query());
    }

    @Test
    public void query2(){
        queryFactory2.query().from(QMovie.movie);
    }

    @Test
    public void query3() {
        Mockito.when(entityManagerMock.getEntityManagerFactory()).thenReturn(factoryMock);
        Mockito.when(factoryMock.getProperties()).thenReturn(properties);
        Mockito.when(entityManagerMock.getDelegate()).thenReturn(entityManagerMock);

        queryFactory3.query().from(QMovie.movie);

       // Mockito.verify(entityManagerMock,factoryMock);

    }

    @Test
    public void from(){
        assertNotNull(queryFactory.from(QMovie.movie));
    }

    @Test
    public void delete(){
        assertNotNull(queryFactory.delete(QMovie.movie));
    }

    @Test
    public void delete2(){
        queryFactory2.delete(QMovie.movie).where(QMovie.movie.id.gt(0));
    }

    @Test
    public void update(){
        assertNotNull(queryFactory.update(QMovie.movie));
    }

    @Test
    public void update2(){
        queryFactory2.update(QMovie.movie)
                .set(QMovie.movie.title,"Test")
                .where(QMovie.movie.title.isNull());
    }

    @Test
    public void select(){
        queryFactory2.select(QMovie.movie)
                .from(QMovie.movie);
    }

    @Test
    public void remove(){
        Actor actor = new Actor();
        Movie movie = new Movie();


        actor.setName("Soco");

        actor.setId(1L);

        List<Actor> actorList  = new ArrayList<>();
        actorList.add(actor);
        movie.setActors(actorList);

        queryFactory2.update(QMovie.movie).set(QMovie.movie,movie).where(QMovie.movie.isNull());


        queryFactory2.from(QMovie.movie)
                .select(QMovie.movie)
                .where(QMovie.movie.actors.contains(actor)).fetch();

    }
}
