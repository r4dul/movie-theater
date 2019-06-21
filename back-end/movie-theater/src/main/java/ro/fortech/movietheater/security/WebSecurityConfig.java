package ro.fortech.movietheater.security;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import ro.fortech.movietheater.securityConfig.JwtAuthenticationEntryPoint;
import ro.fortech.movietheater.securityConfig.JwtAuthenticationTokenFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private JwtAuthenticationTokenFilter jwtAuthenticationTokenFilter;

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    private UserDetailsService userDetailsService;

    @Bean(name = BeanIds.AUTHENTICATION_MANAGER)
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    /** We encode input password from Login page with BCrypt and then compare it with the one in DB*/
    @Autowired
    public void encryptPassword(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        authenticationManagerBuilder
                .userDetailsService(this.userDetailsService)
                .passwordEncoder(new BCryptPasswordEncoder());
    }

    @Override
    public void configure(WebSecurity web) throws Exception {

        web.ignoring()
                .antMatchers("/js/*",
                        "/css/*"
                );
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http
                .csrf().disable() //No need for CSRF
                .exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint)//We handle possible errors thrown by DB query
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) //No need for Session
                .and()
                .authorizeRequests()
                .antMatchers(HttpMethod.GET)
                .permitAll()
                .antMatchers(HttpMethod.POST , "/login")
                .permitAll()

                .antMatchers(HttpMethod.POST, "/api/users")
                .permitAll()

                .antMatchers(HttpMethod.DELETE, "/api/users/{id}")
                .authenticated()

                .antMatchers(HttpMethod.POST, "/api/reviews/{movieId}")
                .authenticated()

                .antMatchers(HttpMethod.POST, "/api/users/photo")
                .authenticated()

                .antMatchers(HttpMethod.DELETE, "/api/reviews/{id}")
                .hasRole("ADMIN")

                .antMatchers(HttpMethod.POST,"/api/actors")
                .hasRole("ADMIN")

                .antMatchers("/api/users/{userId}/**")
                .authenticated()

                .antMatchers(HttpMethod.DELETE , "/api/movies/{movieId}")
                .authenticated()
                .anyRequest().hasRole("ADMIN")

                .antMatchers(HttpMethod.POST , "/api/movies")
                .authenticated().anyRequest().hasRole("ADMIN")

                .antMatchers(HttpMethod.PUT , "/api/movies/{movieId}/{score}")
                .authenticated()
                .anyRequest().hasAnyRole("USER", "ADMIN")
                .and()/**We use our custom filter to check the token first */
                .addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);

        http
                .headers().cacheControl();
        http.cors();
    }
}
