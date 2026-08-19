package com.threatlens.backend.network.service;
import com.threatlens.backend.network.dto.NetworkGraphEdge;
import com.threatlens.backend.network.dto.NetworkGraphNode;
import com.threatlens.backend.network.dto.NetworkGraphResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import com.threatlens.backend.network.dto.NetworkConnectionRequest;
import com.threatlens.backend.network.entity.NetworkAsset;
import com.threatlens.backend.network.entity.NetworkConnection;
import com.threatlens.backend.network.repository.NetworkAssetRepository;
import com.threatlens.backend.network.repository.NetworkConnectionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NetworkConnectionService {

    private final NetworkConnectionRepository connectionRepository;
    private final NetworkAssetRepository assetRepository;

    public NetworkConnectionService(
            NetworkConnectionRepository connectionRepository,
            NetworkAssetRepository assetRepository
    ) {
        this.connectionRepository = connectionRepository;
        this.assetRepository = assetRepository;
    }

    public NetworkConnection createConnection(
            NetworkConnectionRequest request
    ) {

        NetworkAsset source = assetRepository
                .findById(request.sourceAssetId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Source asset not found"
                        )
                );

        NetworkAsset destination = assetRepository
                .findById(request.destinationAssetId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Destination asset not found"
                        )
                );

        NetworkConnection connection = NetworkConnection.builder()
                .sourceAsset(source)
                .destinationAsset(destination)
                .connectionType(request.connectionType())
                .port(request.port())
                .protocol(request.protocol())
                .status(
                        request.status() == null
                                ? "ACTIVE"
                                : request.status()
                )
                .build();

        return connectionRepository.save(connection);
    }

    public List<NetworkConnection> getAllConnections() {

        return connectionRepository.findAll();
    }

    public NetworkConnection getConnectionById(Long id) {

        return connectionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Network connection not found"
                        )
                );
    }

    public void deleteConnection(Long id) {

        NetworkConnection connection =
                getConnectionById(id);

        connectionRepository.delete(connection);
    }
public NetworkGraphResponse getNetworkGraph() {

    List<NetworkConnection> connections =
            connectionRepository.findAll();

    Map<Long, NetworkGraphNode> nodeMap = new HashMap<>();

    List<NetworkGraphEdge> edges = new ArrayList<>();

    for (NetworkConnection connection : connections) {

        NetworkAsset source = connection.getSourceAsset();
        NetworkAsset destination = connection.getDestinationAsset();

        nodeMap.putIfAbsent(
                source.getId(),
                new NetworkGraphNode(
                        source.getId().toString(),
                        source.getName(),
                        source.getDeviceType(),
                        source.getIpAddress(),
                        source.getRiskLevel()
                )
        );

        nodeMap.putIfAbsent(
                destination.getId(),
                new NetworkGraphNode(
                        destination.getId().toString(),
                        destination.getName(),
                        destination.getDeviceType(),
                        destination.getIpAddress(),
                        destination.getRiskLevel()
                )
        );

        edges.add(
                new NetworkGraphEdge(
                        "connection-" + connection.getId(),
                        source.getId().toString(),
                        destination.getId().toString(),
                        connection.getProtocol(),
                        connection.getPort(),
                        connection.getConnectionType()
                )
        );
    }

    return new NetworkGraphResponse(
            new ArrayList<>(nodeMap.values()),
            edges
    );
}
}
