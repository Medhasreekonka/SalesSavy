package com.kodnest.demo.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.kodnest.demo.Entity.JWTToken;
import com.kodnest.demo.Entity.User;
import com.kodnest.demo.Repository.JWTTokenRepository;
import com.kodnest.demo.Repository.UserRepository;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class AuthService {

    private final Key signingKey;
    private final long jwtExpiration;

    private final UserRepository userRepository;
    private final JWTTokenRepository jwtTokenRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(
            UserRepository userRepository,
            JWTTokenRepository jwtTokenRepository,
            @Value("${jwt.secret}") String jwtSecret,
            @Value("${jwt.expiration}") long jwtExpiration) {

        this.userRepository = userRepository;
        this.jwtTokenRepository = jwtTokenRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.jwtExpiration = jwtExpiration;

        byte[] secretBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);

        if (secretBytes.length < 64) {
            throw new IllegalArgumentException(
                    "JWT secret must be at least 64 bytes long for HS512.");
        }

        this.signingKey = Keys.hmacShaKeyFor(secretBytes);
    }

    public User authenticate(String username, String password) {

        if (username == null || username.isBlank()
                || password == null || password.isBlank()) {

            throw new RuntimeException("Invalid username or password");
        }

        User user = userRepository
                .findByUsername(username.trim())
                .orElseThrow(() ->
                        new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        return user;
    }

    public String generateToken(User user) {

        LocalDateTime now = LocalDateTime.now();

        JWTToken existingToken =
                jwtTokenRepository.findByUserId(user.getUserId());

        if (existingToken != null
                && now.isBefore(existingToken.getExpiresAt())) {

            return existingToken.getToken();
        }

        if (existingToken != null) {
            jwtTokenRepository.delete(existingToken);
        }

        String token = generateNewToken(user);

        saveToken(user, token);

        return token;
    }

    private String generateNewToken(User user) {

        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("role", user.getRole().name())
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(signingKey, SignatureAlgorithm.HS512)
                .compact();
    }

    private void saveToken(User user, String token) {

        JWTToken jwtToken =
                new JWTToken(
                        user,
                        token,
                        LocalDateTime.now()
                                .plus(java.time.Duration.ofMillis(jwtExpiration)));

        jwtTokenRepository.save(jwtToken);
    }

    public void logout(User user) {

        if (user != null) {
            jwtTokenRepository.deleteByUserId(user.getUserId());
        }
    }

    public boolean validateToken(String token) {

        if (token == null || token.isBlank()) {
            return false;
        }

        try {

            Jwts.parserBuilder()
                    .setSigningKey(signingKey)
                    .build()
                    .parseClaimsJws(token);

            Optional<JWTToken> jwtToken =
                    jwtTokenRepository.findByToken(token);

            return jwtToken.isPresent()
                    && jwtToken.get()
                            .getExpiresAt()
                            .isAfter(LocalDateTime.now());

        } catch (Exception e) {
            return false;
        }
    }

    public String extractUsername(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}