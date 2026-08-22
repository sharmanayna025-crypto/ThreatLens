package com.threatlens.backend.simulation.dto;

public record SimulationResponse(
        Long id,
        Long sourceAssetId,
        Long destinationAssetId,
        String attackType,
        String status,
        String result,
        Integer riskScore,
        String startedAt
) {
}
