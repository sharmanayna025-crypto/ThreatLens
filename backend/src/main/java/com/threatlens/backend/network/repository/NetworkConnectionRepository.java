package com.threatlens.backend.network.repository;

import com.threatlens.backend.network.entity.NetworkConnection;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NetworkConnectionRepository
        extends JpaRepository<NetworkConnection, Long> {
}
