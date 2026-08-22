package com.threatlens.backend.simulation.controller;

import com.threatlens.backend.simulation.dto.SimulationRequest;
import com.threatlens.backend.simulation.entity.Simulation;
import com.threatlens.backend.simulation.repository.SimulationRepository;
import com.threatlens.backend.simulation.service.SimulationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/simulations")
@CrossOrigin(origins = "http://localhost:5173")
public class SimulationController {

    private final SimulationService simulationService;
    private final SimulationRepository simulationRepository;

    public SimulationController(
            SimulationService simulationService,
            SimulationRepository simulationRepository
    ) {
        this.simulationService = simulationService;
        this.simulationRepository = simulationRepository;
    }

    // Run a new simulation
    @PostMapping
    public ResponseEntity<Simulation> runSimulation(
            @RequestBody SimulationRequest request
    ) {

        return ResponseEntity.ok(
                simulationService.runSimulation(request)
        );
    }

    // Get all simulations
    @GetMapping
    public ResponseEntity<List<Simulation>> getSimulations() {

        return ResponseEntity.ok(
                simulationRepository.findAll()
        );
    }
@GetMapping("/{id}")
public ResponseEntity<Simulation> getSimulationById(
        @PathVariable Long id
) {

    return simulationRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
}
    // Delete a simulation
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSimulation(
            @PathVariable Long id
    ) {

        if (!simulationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        simulationRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
