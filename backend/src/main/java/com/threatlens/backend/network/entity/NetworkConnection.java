package com.threatlens.backend.network.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "network_connections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NetworkConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "source_asset_id", nullable = false)
    private NetworkAsset sourceAsset;

    @ManyToOne
    @JoinColumn(name = "destination_asset_id", nullable = false)
    private NetworkAsset destinationAsset;

    private String connectionType;

    private Integer port;

    private String protocol;

    private String status;
}
