package com.threatlens.backend.simulation.repository;

import com.threatlens.backend.simulation.entity.Simulation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SimulationRepository
        extends JpaRepository<Simulation, Long> {
}
