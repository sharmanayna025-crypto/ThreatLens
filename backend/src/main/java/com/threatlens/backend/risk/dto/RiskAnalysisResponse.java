package com.threatlens.backend.risk.dto;

public record RiskAnalysisResponse(

        int overallRiskScore,

        String riskLevel,

        int totalThreats,

        int criticalThreats,

        int highThreats,

        int mediumThreats,

        int lowThreats

) {
}
