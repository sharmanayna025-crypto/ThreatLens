package com.threatlens.backend.network.controller;

import com.threatlens.backend.network.entity.NetworkAsset;
import com.threatlens.backend.network.service.NetworkAssetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/network/assets")
@CrossOrigin(origins = "http://localhost:5173")
public class NetworkAssetController {

    private final NetworkAssetService networkAssetService;

    public NetworkAssetController(
            NetworkAssetService networkAssetService
    ) {
        this.networkAssetService = networkAssetService;
    }

    @PostMapping
    public ResponseEntity<NetworkAsset> createAsset(
            @RequestBody NetworkAsset asset
    ) {

        return ResponseEntity.ok(
                networkAssetService.createAsset(asset)
        );
    }

    @GetMapping
    public ResponseEntity<List<NetworkAsset>> getAllAssets() {

        return ResponseEntity.ok(
                networkAssetService.getAllAssets()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<NetworkAsset> getAsset(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                networkAssetService.getAssetById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<NetworkAsset> updateAsset(
            @PathVariable Long id,
            @RequestBody NetworkAsset asset
    ) {

        return ResponseEntity.ok(
                networkAssetService.updateAsset(id, asset)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAsset(
            @PathVariable Long id
    ) {

        networkAssetService.deleteAsset(id);

        return ResponseEntity.ok(
                "Network asset deleted successfully"
        );
    }
}
