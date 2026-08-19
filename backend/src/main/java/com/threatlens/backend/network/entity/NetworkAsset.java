package com.threatlens.backend.network.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "network_assets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NetworkAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String ipAddress;

    private String macAddress;

    private String deviceType;

    private String operatingSystem;

    private String status;

    private String riskLevel;
}
