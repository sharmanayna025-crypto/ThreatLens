package com.threatlens.backend.network.service;

import com.threatlens.backend.network.entity.NetworkAsset;
import com.threatlens.backend.network.repository.NetworkAssetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NetworkAssetService {

    private final NetworkAssetRepository networkAssetRepository;

    public NetworkAssetService(
            NetworkAssetRepository networkAssetRepository
    ) {
        this.networkAssetRepository = networkAssetRepository;
    }

    public NetworkAsset createAsset(NetworkAsset asset) {

        if (asset.getStatus() == null || asset.getStatus().isBlank()) {
            asset.setStatus("ACTIVE");
        }

        if (asset.getRiskLevel() == null || asset.getRiskLevel().isBlank()) {
            asset.setRiskLevel("UNKNOWN");
        }

        return networkAssetRepository.save(asset);
    }

    public List<NetworkAsset> getAllAssets() {
        return networkAssetRepository.findAll();
    }

    public NetworkAsset getAssetById(Long id) {

        return networkAssetRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Network asset not found with id: " + id
                        )
                );
    }

    public NetworkAsset updateAsset(
            Long id,
            NetworkAsset updatedAsset
    ) {

        NetworkAsset existingAsset = getAssetById(id);

        existingAsset.setName(updatedAsset.getName());
        existingAsset.setIpAddress(updatedAsset.getIpAddress());
        existingAsset.setMacAddress(updatedAsset.getMacAddress());
        existingAsset.setDeviceType(updatedAsset.getDeviceType());
        existingAsset.setOperatingSystem(updatedAsset.getOperatingSystem());
        existingAsset.setStatus(updatedAsset.getStatus());
        existingAsset.setRiskLevel(updatedAsset.getRiskLevel());

        return networkAssetRepository.save(existingAsset);
    }

    public void deleteAsset(Long id) {

        NetworkAsset asset = getAssetById(id);

        networkAssetRepository.delete(asset);
    }
}
