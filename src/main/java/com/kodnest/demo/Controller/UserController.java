package com.kodnest.demo.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kodnest.demo.Entity.User;
import com.kodnest.demo.Service.UserService;

@RestController
@CrossOrigin(origins="http://localhost:5173")
@RequestMapping("/api/users")
public class UserController {
	
	private final UserService userService;
	
	@Autowired
	public UserController(UserService userService) {
		this.userService = userService;
	}
	
	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@RequestBody User user) {
	    try {
	        userService.registerUser(user);

	        return ResponseEntity.ok(
	            Map.of("message", "User registered successfully")
	        );

	    } catch (RuntimeException e) {
	        return ResponseEntity.badRequest()
	                .body(Map.of("error", e.getMessage()));
	    }
	}
}
