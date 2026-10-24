package com.kodnest.demo.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kodnest.demo.Entity.User;
import com.kodnest.demo.Service.AuthService;
import com.kodnest.demo.dto.LoginRequest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin(origins="http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/auth")
public class AuthController {
	private final AuthService authService;
	@Autowired
	public AuthController(AuthService authService) {
		this.authService = authService; 
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
	    try {
		        User user = authService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());
		        String token = authService.generateToken(user);
	
		        response.addHeader(
		        	    "Set-Cookie",
		        	    "authToken=" + token
		        	        + "; Max-Age=3600"
		        	        + "; Path=/"
		        	        + "; HttpOnly"
		        	        + "; SameSite=Lax"
		        	);
	
		        Map<String, Object> responseBody = new HashMap<>();
		        responseBody.put("message", "Login successful");
		        responseBody.put("role", user.getRole().name());
		        responseBody.put("username", user.getUsername());
	
		        return ResponseEntity.ok(responseBody);
	    }
	    catch (RuntimeException e) {
	    	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
	    }
	}
	@PostMapping("/logout")
	public ResponseEntity<Map<String, String>> logout(
	        HttpServletRequest request,
	        HttpServletResponse response) {

	    try {
	        User user = (User) request.getAttribute("authenticatedUser");

	        if (user != null) {
	            authService.logout(user);
	        }

	        response.addHeader(
	        	    "Set-Cookie",
	        	    "authToken=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax"
	        	);

	        Map<String, String> responseBody = new HashMap<>();
	        responseBody.put("message", "Logout successful");

	        return ResponseEntity.ok(responseBody);

	    } catch (Exception e) {

	    	response.addHeader(
	                "Set-Cookie",
	                "authToken=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax"
	        );

	        return ResponseEntity.ok(
	                Map.of("message", "Logout successful")
	        );
	    }
	}
}