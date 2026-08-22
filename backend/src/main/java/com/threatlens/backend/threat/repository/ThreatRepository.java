package com.threatlens.backend.threat.repository;

import com.threatlens.backend.threat.entity.Threat;
import com.threatlens.backend.threat.entity.ThreatStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ThreatRepository extends JpaRepository<Threat, Long> {

    List<Threat> findByStatus(ThreatStatus status);

    List<Threat> findAllByOrderByDetectedAtDesc();
}
