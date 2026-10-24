// Admin Controller for Modify User functionality
package com.kodnest.demo.admincontrollers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kodnest.demo.Entity.User;
import com.kodnest.demo.adminservices.AdminUserService;

@RestController
@RequestMapping("/admin/user")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @PutMapping("/modify")
    public ResponseEntity<?> modifyUser(
            @RequestBody Map<String, Object> userRequest) {

        try {
            if (userRequest == null || userRequest.get("userId") == null) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("User ID is required");
            }

            Integer userId =
                    Integer.valueOf(userRequest.get("userId").toString());

            String username =
                    userRequest.get("username") != null
                            ? userRequest.get("username").toString().trim()
                            : "";

            String email =
                    userRequest.get("email") != null
                            ? userRequest.get("email").toString().trim()
                            : "";

            String role =
                    userRequest.get("role") != null
                            ? userRequest.get("role").toString().trim()
                            : "";

            if (username.isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Username is required");
            }

            if (email.isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Email is required");
            }

            if (role.isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Role is required");
            }

            User updatedUser =
                    adminUserService.modifyUser(
                            userId,
                            username,
                            email,
                            role
                    );

            Map<String, Object> response = new HashMap<>();

            response.put("userId", updatedUser.getUserId());
            response.put("username", updatedUser.getUsername());
            response.put("email", updatedUser.getEmail());
            response.put("role", updatedUser.getRole().name());
            response.put("createdAt", updatedUser.getCreatedAt());
            response.put("updatedAt", updatedUser.getUpdatedAt());

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(response);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Something went wrong");
        }
    }

    @PostMapping("/getbyid")
    public ResponseEntity<?> getUserById(
            @RequestBody Map<String, Object> userRequest) {

        try {
            if (userRequest == null || userRequest.get("userId") == null) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("User ID is required");
            }

            Integer userId =
                    Integer.valueOf(userRequest.get("userId").toString());

            User user = adminUserService.getUserById(userId);

            Map<String, Object> response = new HashMap<>();

            response.put("userId", user.getUserId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("role", user.getRole().name());
            response.put("createdAt", user.getCreatedAt());
            response.put("updatedAt", user.getUpdatedAt());

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(response);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Something went wrong");
        }
    }
}