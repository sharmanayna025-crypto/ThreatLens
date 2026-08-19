package com.threatlens.backend.network.dto;

import java.util.List;

public record NetworkGraphResponse(
        List<NetworkGraphNode> nodes,
        List<NetworkGraphEdge> edges
) {
}
