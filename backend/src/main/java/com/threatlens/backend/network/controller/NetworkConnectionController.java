package com.threatlens.backend.network.controller;
import com.threatlens.backend.network.dto.NetworkGraphResponse;
import com.threatlens.backend.network.dto.NetworkConnectionRequest;
import com.threatlens.backend.network.entity.NetworkConnection;
import com.threatlens.backend.network.service.NetworkConnectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/network/connections")
@CrossOrigin(origins = "http://localhost:5173")
public class NetworkConnectionController {

    private final NetworkConnectionService connectionService;

    public NetworkConnectionController(
            NetworkConnectionService connectionService
    ) {
        this.connectionService = connectionService;
    }

    @PostMapping
    public ResponseEntity<NetworkConnection> createConnection(
            @RequestBody NetworkConnectionRequest request
    ) {

        return ResponseEntity.ok(
                connectionService.createConnection(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<NetworkConnection>> getAllConnections() {

        return ResponseEntity.ok(
                connectionService.getAllConnections()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<NetworkConnection> getConnection(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                connectionService.getConnectionById(id)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteConnection(
            @PathVariable Long id
    ) {

        connectionService.deleteConnection(id);

        return ResponseEntity.ok(
                "Network connection deleted successfully"
        );
    }
@GetMapping("/graph")
public ResponseEntity<NetworkGraphResponse> getNetworkGraph() {

    return ResponseEntity.ok(
            connectionService.getNetworkGraph()
    );
}
}
