package com.threatlens.backend.auth.dto;

public record AuthResponse(
        String message,
        String token
) {
}
