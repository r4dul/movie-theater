package ro.fortech.movietheater.controller;


import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import ro.fortech.movietheater.entity.Actor;
import ro.fortech.movietheater.repository.ActorRepository;
import ro.fortech.movietheater.service.ActorService;

import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.CoreMatchers.containsString;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ActorControllerTest {

    @MockBean
    private ActorService actorService;

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void getActors() throws Exception {

//        List<Actor> mockActorList = new ArrayList<>();
//
//        Actor mockActor = new Actor();
//        mockActor.setId(1L);
//        mockActor.setName("Tom");
//        mockActor.setMovies(null);
//
//        mockActorList.add(mockActor);
//
//        given(actorService.getAllActors()).willReturn(mockActorList);
//
//        this.mockMvc.perform(get("/api/actors")).andExpect(status().isOk());
    }
}
