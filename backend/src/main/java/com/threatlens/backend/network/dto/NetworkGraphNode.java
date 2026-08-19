package com.threatlens.backend.network.dto;

public record NetworkGraphNode(
        String id,
        String label,
        String deviceType,
        String ipAddress,
        String riskLevel
) {
}
