package com.threatlens.backend.risk.service;

import com.threatlens.backend.risk.dto.RiskAnalysisResponse;
import com.threatlens.backend.threat.entity.Severity;
import com.threatlens.backend.threat.entity.Threat;
import com.threatlens.backend.threat.repository.ThreatRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RiskService {

    private final ThreatRepository threatRepository;

    public RiskService(ThreatRepository threatRepository) {
        this.threatRepository = threatRepository;
    }

    public RiskAnalysisResponse calculateRisk() {

        List<Threat> threats = threatRepository.findAll();

        int criticalCount = 0;
        int highCount = 0;
        int mediumCount = 0;
        int lowCount = 0;

        int totalScore = 0;

        for (Threat threat : threats) {

            Severity severity = threat.getSeverity();

            if (severity == Severity.CRITICAL) {
                criticalCount++;
                totalScore += 100;

            } else if (severity == Severity.HIGH) {
                highCount++;
                totalScore += 75;

            } else if (severity == Severity.MEDIUM) {
                mediumCount++;
                totalScore += 50;

            } else if (severity == Severity.LOW) {
                lowCount++;
                totalScore += 25;
            }
        }

        int totalThreats = threats.size();

        int averageRisk = totalThreats == 0
                ? 0
                : Math.round((float) totalScore / totalThreats);

        String riskLevel;

        if (averageRisk >= 80) {
            riskLevel = "CRITICAL";
        } else if (averageRisk >= 60) {
            riskLevel = "HIGH";
        } else if (averageRisk >= 40) {
            riskLevel = "MEDIUM";
        } else {
            riskLevel = "LOW";
        }

        return new RiskAnalysisResponse(
                averageRisk,
                riskLevel,
                totalThreats,
                criticalCount,
                highCount,
                mediumCount,
                lowCount
        );
    }
}