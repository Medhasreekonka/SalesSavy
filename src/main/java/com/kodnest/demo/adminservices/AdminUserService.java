// Admin Service for Modify User functionality
package com.kodnest.demo.adminservices;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.kodnest.demo.Entity.Role;
import com.kodnest.demo.Entity.User;
import com.kodnest.demo.Repository.JWTTokenRepository;
import com.kodnest.demo.Repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class AdminUserService {

    private final UserRepository userRepository;
    private final JWTTokenRepository jwtTokenRepository;

    public AdminUserService(
            UserRepository userRepository,
            JWTTokenRepository jwtTokenRepository) {

        this.userRepository = userRepository;
        this.jwtTokenRepository = jwtTokenRepository;
    }

    @Transactional
    public User modifyUser(
            Integer userId,
            String username,
            String email,
            String role) {

        // 1. Check if user exists
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }

        User existingUser = userOptional.get();

        // 2. Validate username
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }

        username = username.trim();

        // 3. Check duplicate username
        Optional<User> userWithUsername =
                userRepository.findByUsername(username);

        if (userWithUsername.isPresent()
                && !userWithUsername.get().getUserId().equals(userId)) {

            throw new IllegalArgumentException(
                    "Username already exists");
        }

        // 4. Validate email
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }

        email = email.trim();

        // 5. Check duplicate email
        Optional<User> userWithEmail =
                userRepository.findByEmail(email);

        if (userWithEmail.isPresent()
                && !userWithEmail.get().getUserId().equals(userId)) {

            throw new IllegalArgumentException(
                    "Email already exists");
        }

        // 6. Validate role
        if (role == null || role.trim().isEmpty()) {
            throw new IllegalArgumentException("Role is required");
        }

        Role newRole;

        try {
            newRole = Role.valueOf(role.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Invalid role: " + role);
        }

        // 7. Update user details
        existingUser.setUsername(username);
        existingUser.setEmail(email);
        existingUser.setRole(newRole);

        // 8. Invalidate existing JWT tokens
        jwtTokenRepository.deleteByUserId(userId);

        // 9. Save updated user
        return userRepository.save(existingUser);
    }

    public User getUserById(Integer userId) {

        if (userId == null) {
            throw new IllegalArgumentException("User ID is required");
        }

        return userRepository.findById(userId)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "User not found"));
    }
}