package com.threatlens.backend.threat.controller;

import com.threatlens.backend.threat.entity.Threat;
import com.threatlens.backend.threat.entity.ThreatStatus;
import com.threatlens.backend.threat.service.ThreatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/threats")
public class ThreatController {

    private final ThreatService threatService;

    public ThreatController(ThreatService threatService) {
        this.threatService = threatService;
    }

    @GetMapping
    public ResponseEntity<List<Threat>> getAllThreats() {
        return ResponseEntity.ok(threatService.getAllThreats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Threat> getThreatById(@PathVariable Long id) {
        return ResponseEntity.ok(threatService.getThreatById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Threat>> getThreatsByStatus(
            @PathVariable ThreatStatus status
    ) {
        return ResponseEntity.ok(
                threatService.getThreatsByStatus(status)
        );
    }

    @PostMapping
    public ResponseEntity<Threat> createThreat(
            @RequestBody Threat threat,
            @RequestParam Long sourceAssetId,
            @RequestParam Long destinationAssetId
    ) {
        return ResponseEntity.ok(
                threatService.createThreat(
                        threat,
                        sourceAssetId,
                        destinationAssetId
                )
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Threat> updateStatus(
            @PathVariable Long id,
            @RequestParam ThreatStatus status
    ) {
        return ResponseEntity.ok(
                threatService.updateStatus(id, status)
        );
    }
}
