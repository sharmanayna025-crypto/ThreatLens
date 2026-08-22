package com.threatlens.backend.simulation.dto;

public record SimulationRequest(
        Long sourceAssetId,
        Long destinationAssetId,
        String attackType
) {
}
