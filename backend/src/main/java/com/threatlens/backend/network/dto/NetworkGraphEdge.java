package com.threatlens.backend.network.dto;

public record NetworkGraphEdge(
        String id,
        String source,
        String target,
        String protocol,
        Integer port,
        String connectionType
) {
}
