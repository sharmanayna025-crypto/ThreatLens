package com.threatlens.backend.network.repository;

import com.threatlens.backend.network.entity.NetworkAsset;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NetworkAssetRepository
        extends JpaRepository<NetworkAsset, Long> {
}
