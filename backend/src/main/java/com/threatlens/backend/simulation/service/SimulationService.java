package com.threatlens.backend.simulation.service;

import com.threatlens.backend.network.entity.NetworkAsset;
import com.threatlens.backend.network.repository.NetworkAssetRepository;
import com.threatlens.backend.simulation.dto.SimulationRequest;
import com.threatlens.backend.simulation.entity.Simulation;
import com.threatlens.backend.simulation.repository.SimulationRepository;
import com.threatlens.backend.threat.entity.Severity;
import com.threatlens.backend.threat.entity.Threat;
import com.threatlens.backend.threat.entity.ThreatStatus;
import com.threatlens.backend.threat.entity.ThreatType;
import com.threatlens.backend.threat.repository.ThreatRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SimulationService {

    private final SimulationRepository simulationRepository;
    private final NetworkAssetRepository networkAssetRepository;
    private final ThreatRepository threatRepository;

    public SimulationService(
            SimulationRepository simulationRepository,
            NetworkAssetRepository networkAssetRepository,
            ThreatRepository threatRepository
    ) {
        this.simulationRepository = simulationRepository;
        this.networkAssetRepository = networkAssetRepository;
        this.threatRepository = threatRepository;
    }

    public Simulation runSimulation(SimulationRequest request) {

        // ---------------------------------------------------------
        // Find source asset
        // ---------------------------------------------------------

        NetworkAsset source = networkAssetRepository
                .findById(request.sourceAssetId())
                .orElseThrow(() ->
                        new RuntimeException("Source asset not found")
                );

        // ---------------------------------------------------------
        // Find destination asset
        // ---------------------------------------------------------

        NetworkAsset target = networkAssetRepository
                .findById(request.destinationAssetId())
                .orElseThrow(() ->
                        new RuntimeException("Destination asset not found")
                );

        // ---------------------------------------------------------
        // Source and destination cannot be the same
        // ---------------------------------------------------------

        if (source.getId().equals(target.getId())) {
            throw new RuntimeException(
                    "Source and destination assets must be different"
            );
        }

        // ---------------------------------------------------------
        // Calculate risk score
        // ---------------------------------------------------------

        int riskScore = 50;

        // Target asset risk
        if ("CRITICAL".equalsIgnoreCase(target.getRiskLevel())) {
            riskScore += 30;
        } else if ("HIGH".equalsIgnoreCase(target.getRiskLevel())) {
            riskScore += 25;
        } else if ("MEDIUM".equalsIgnoreCase(target.getRiskLevel())) {
            riskScore += 10;
        }

        // Attack type
        if ("BRUTE_FORCE".equalsIgnoreCase(request.attackType())) {
            riskScore += 10;
        } else if ("PORT_SCAN".equalsIgnoreCase(request.attackType())) {
            riskScore += 5;
        } else if ("MALWARE".equalsIgnoreCase(request.attackType())) {
            riskScore += 15;
        } else if ("DDoS".equalsIgnoreCase(request.attackType())) {
            riskScore += 20;
        }

        // Maximum risk score = 100
        riskScore = Math.min(riskScore, 100);

        // ---------------------------------------------------------
        // Determine risk level
        // ---------------------------------------------------------

        String riskLevel;

        if (riskScore >= 80) {
            riskLevel = "CRITICAL";
        } else if (riskScore >= 60) {
            riskLevel = "HIGH";
        } else if (riskScore >= 40) {
            riskLevel = "MEDIUM";
        } else {
            riskLevel = "LOW";
        }

        // ---------------------------------------------------------
        // Create simulation
        // ---------------------------------------------------------

        Simulation simulation = new Simulation();

        simulation.setSourceAsset(source);
        simulation.setTargetAsset(target);
        simulation.setAttackType(request.attackType());

        simulation.setRiskScore(riskScore);
        simulation.setRiskLevel(riskLevel);

        simulation.setStatus("COMPLETED");
        simulation.setResult(
                "Simulation completed successfully"
        );
        simulation.setStartedAt(LocalDateTime.now());

        // Save simulation first
        Simulation savedSimulation =
                simulationRepository.save(simulation);

        // ---------------------------------------------------------
        // Create corresponding threat
        // ---------------------------------------------------------

        Threat threat = new Threat();

        // Convert attack type String → ThreatType enum
        ThreatType threatType;

        try {
            threatType = ThreatType.valueOf(
                    request.attackType().toUpperCase()
            );
        } catch (IllegalArgumentException e) {
            threatType = ThreatType.SUSPICIOUS_TRAFFIC;
        }

        threat.setThreatType(threatType);

        threat.setDescription(
                "Simulated " +
                threatType.name().replace("_", " ") +
                " detected from " +
                source.getName() +
                " to " +
                target.getName()
        );

        threat.setSourceAsset(source);
        threat.setDestinationAsset(target);

        // Convert risk level → Severity enum
        Severity severity = Severity.valueOf(
                riskLevel
        );

        threat.setSeverity(severity);

        // New threats start as OPEN
        threat.setStatus(ThreatStatus.OPEN);

        threat.setDetectedAt(LocalDateTime.now());

        threatRepository.save(threat);

        // ---------------------------------------------------------
        // Return simulation
        // ---------------------------------------------------------

        return savedSimulation;
    }
}
