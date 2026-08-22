package com.threatlens.backend.simulation.entity;

import com.threatlens.backend.network.entity.NetworkAsset;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "simulations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Simulation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_asset_id", nullable = false)
    private NetworkAsset sourceAsset;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_asset_id", nullable = false)
    private NetworkAsset targetAsset;

    @Column(name = "attack_type", nullable = false)
    private String attackType;

    @Column(name = "risk_score", nullable = false)
    private Integer riskScore;

    @Column(name = "risk_level", nullable = false)
    private String riskLevel;

    @Column(nullable = false)
    private String status;

    @Column
    private String result;

    @Column(name = "started_at")
    private LocalDateTime startedAt;
}
