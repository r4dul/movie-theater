package ro.fortech.movietheater.controller;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ro.fortech.movietheater.entity.User;
import ro.fortech.movietheater.securityConfig.JwtAuthenticationRequest;
import ro.fortech.movietheater.securityConfig.JwtAuthenticationResponse;
import ro.fortech.movietheater.securityConfig.JwtTokenUtil;
import ro.fortech.movietheater.securityConfig.JwtUser;
import ro.fortech.movietheater.service.UserService;

import javax.validation.Valid;
@RestController
@RequestMapping(path = "/login")
@CrossOrigin
public class AuthenticationController {

    private  Logger LOGGER = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> loginAndCreateToken(@RequestBody @Valid JwtAuthenticationRequest authenticationRequest, BindingResult result) {
        User user = userService.findUserByUsername(authenticationRequest.getUsername());
        if (user == null || user.isEnabled() == false) {
            if (user == null) {
                LOGGER.error("Username " + authenticationRequest.getUsername() + " was not found.");
                return new ResponseEntity<>("Username not found!", HttpStatus.NOT_FOUND);
            } else {
                LOGGER.error("Username " + authenticationRequest.getUsername() + " is not confirmed.");
                return new ResponseEntity<>("Please confirm your account first.", HttpStatus.BAD_REQUEST);
            }
        }

        if (result.hasErrors()) {
            LOGGER.error("Login error");
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                authenticationRequest.getUsername(), authenticationRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        JwtUser userDetails = userService.loadUserByUsername(authenticationRequest.getUsername());
        String token = jwtTokenUtil.generateJwtToken(userDetails);

        LOGGER.info("User logged in successfully");
        return new ResponseEntity<>(new JwtAuthenticationResponse(token), HttpStatus.OK);
    }
}
