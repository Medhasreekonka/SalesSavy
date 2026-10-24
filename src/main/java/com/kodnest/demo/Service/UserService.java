package com.kodnest.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.kodnest.demo.Entity.Role;
import com.kodnest.demo.Entity.User;
import com.kodnest.demo.Repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User registerUser(User user) {

        if (user == null) {
            throw new IllegalArgumentException(
                    "User details are required");
        }

        String username =
                user.getUsername() == null
                        ? ""
                        : user.getUsername().trim();

        String email =
                user.getEmail() == null
                        ? ""
                        : user.getEmail().trim();

        String password =
                user.getPassword() == null
                        ? ""
                        : user.getPassword();

        if (username.isEmpty()) {
            throw new IllegalArgumentException(
                    "Username is required");
        }

        if (email.isEmpty()) {
            throw new IllegalArgumentException(
                    "Email is required");
        }

        if (password.isBlank()) {
            throw new IllegalArgumentException(
                    "Password is required");
        }

        if (password.length() < 6) {
            throw new IllegalArgumentException(
                    "Password must contain at least 6 characters");
        }

        if (userRepository
                .findByUsername(username)
                .isPresent()) {

            throw new IllegalArgumentException(
                    "Username is already taken");
        }

        if (userRepository
                .findByEmail(email)
                .isPresent()) {

            throw new IllegalArgumentException(
                    "Email is already registered");
        }

        user.setUsername(username);
        user.setEmail(email);

        // Public registration can ONLY create customers.
        user.setRole(Role.CUSTOMER);

        user.setPassword(
                passwordEncoder.encode(password));

        return userRepository.save(user);
    }
}