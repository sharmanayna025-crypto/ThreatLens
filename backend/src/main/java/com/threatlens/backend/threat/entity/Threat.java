package com.threatlens.backend.threat.entity;

import com.threatlens.backend.network.entity.NetworkAsset;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "threats")
public class Threat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ThreatType threatType;

    @Column(nullable = false, length = 500)
    private String description;

    @ManyToOne
    @JoinColumn(name = "source_asset_id")
    private NetworkAsset sourceAsset;

    @ManyToOne
    @JoinColumn(name = "destination_asset_id")
    private NetworkAsset destinationAsset;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Severity severity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ThreatStatus status;

    @Column(nullable = false)
    private LocalDateTime detectedAt;

    public Threat() {
    }

    public Long getId() {
        return id;
    }

    public ThreatType getThreatType() {
        return threatType;
    }

    public void setThreatType(ThreatType threatType) {
        this.threatType = threatType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public NetworkAsset getSourceAsset() {
        return sourceAsset;
    }

    public void setSourceAsset(NetworkAsset sourceAsset) {
        this.sourceAsset = sourceAsset;
    }

    public NetworkAsset getDestinationAsset() {
        return destinationAsset;
    }

    public void setDestinationAsset(NetworkAsset destinationAsset) {
        this.destinationAsset = destinationAsset;
    }

    public Severity getSeverity() {
        return severity;
    }

    public void setSeverity(Severity severity) {
        this.severity = severity;
    }

    public ThreatStatus getStatus() {
        return status;
    }

    public void setStatus(ThreatStatus status) {
        this.status = status;
    }

    public LocalDateTime getDetectedAt() {
        return detectedAt;
    }

    public void setDetectedAt(LocalDateTime detectedAt) {
        this.detectedAt = detectedAt;
    }
}
