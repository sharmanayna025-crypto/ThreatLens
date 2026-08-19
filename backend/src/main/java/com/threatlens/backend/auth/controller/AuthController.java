package com.threatlens.backend.auth.controller;

import com.threatlens.backend.auth.dto.LoginRequest;
import com.threatlens.backend.auth.dto.RegisterRequest;
import com.threatlens.backend.auth.entity.User;
import com.threatlens.backend.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        User user = authService.register(request);

        return ResponseEntity.ok(
                "User registered successfully with id: "
                        + user.getId()
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request
    ) {

        String token = authService.login(request);

        return ResponseEntity.ok(
                new com.threatlens.backend.auth.dto.AuthResponse(
                        "Login successful",
                        token
                )
        );
    }
}
