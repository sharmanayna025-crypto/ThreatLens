package com.threatlens.backend.threat.service;

import com.threatlens.backend.network.entity.NetworkAsset;
import com.threatlens.backend.network.repository.NetworkAssetRepository;
import com.threatlens.backend.threat.entity.Threat;
import com.threatlens.backend.threat.entity.ThreatStatus;
import com.threatlens.backend.threat.repository.ThreatRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ThreatService {

    private final ThreatRepository threatRepository;
    private final NetworkAssetRepository networkAssetRepository;

    public ThreatService(
            ThreatRepository threatRepository,
            NetworkAssetRepository networkAssetRepository
    ) {
        this.threatRepository = threatRepository;
        this.networkAssetRepository = networkAssetRepository;
    }

    public List<Threat> getAllThreats() {
        return threatRepository.findAllByOrderByDetectedAtDesc();
    }

    public List<Threat> getThreatsByStatus(ThreatStatus status) {
        return threatRepository.findByStatus(status);
    }

    public Threat getThreatById(Long id) {
        return threatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Threat not found"));
    }

    public Threat createThreat(
            Threat threat,
            Long sourceAssetId,
            Long destinationAssetId
    ) {

        NetworkAsset sourceAsset = networkAssetRepository
                .findById(sourceAssetId)
                .orElseThrow(() -> new RuntimeException("Source asset not found"));

        NetworkAsset destinationAsset = networkAssetRepository
                .findById(destinationAssetId)
                .orElseThrow(() -> new RuntimeException("Destination asset not found"));

        threat.setSourceAsset(sourceAsset);
        threat.setDestinationAsset(destinationAsset);

        if (threat.getStatus() == null) {
            threat.setStatus(ThreatStatus.OPEN);
        }

        threat.setDetectedAt(LocalDateTime.now());

        return threatRepository.save(threat);
    }

    public Threat updateStatus(Long id, ThreatStatus status) {

        Threat threat = getThreatById(id);

        threat.setStatus(status);

        return threatRepository.save(threat);
    }
}
