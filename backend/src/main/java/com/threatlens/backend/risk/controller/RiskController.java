package com.threatlens.backend.risk.controller;

import com.threatlens.backend.risk.dto.RiskAnalysisResponse;
import com.threatlens.backend.risk.service.RiskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/risk")
@CrossOrigin(origins = "http://localhost:5173")
public class RiskController {

    private final RiskService riskService;

    public RiskController(RiskService riskService) {
        this.riskService = riskService;
    }

    @GetMapping
    public ResponseEntity<RiskAnalysisResponse> getRiskAnalysis() {

        return ResponseEntity.ok(
                riskService.calculateRisk()
        );
    }
}
