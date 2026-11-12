package com.threatlens.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Lightweight public endpoint used to wake / keep alive the Render free-tier
 * service (e.g. from the login page or an uptime monitor).
 */
@RestController
public class HealthController {

    @GetMapping("/health")
    public String health() {
        return "ok";
    }
}
