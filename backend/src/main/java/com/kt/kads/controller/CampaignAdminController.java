package com.kt.kads.controller;

import com.kt.kads.entity.Campaign;
import com.kt.kads.repository.CampaignRepository;
import com.kt.kads.repository.SegmentRepository; // 부모 존재 체크 용
import com.kt.kads.dto.CampaignDto.CampaignUpsertRequest;
import com.kt.kads.dto.CampaignDto.CampaignResponse;
import com.kt.kads.service.ICampaignService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/admin/campaigns")
public class CampaignAdminController {

    private final CampaignRepository repo;
    private final SegmentRepository segmentRepo;
    private final ICampaignService campaignService;

    public CampaignAdminController(CampaignRepository repo, SegmentRepository segmentRepo, ICampaignService campaignService) {
        this.repo = repo;
        this.segmentRepo = segmentRepo;
        this.campaignService = campaignService;
    }

    /* ======= Read ======= */

    @GetMapping
    public List<CampaignResponse> list(
            @RequestParam(name="q", required=false) String q,
            @RequestParam(name="status", required=false) Campaign.Status status,
            @RequestParam(name="from", required=false) String fromStr,
            @RequestParam(name="to", required=false) String toStr,
            @RequestParam(name="segmentId", required=false) Long segmentId
    ) {
        List<Campaign> all;

        if (q != null && !q.trim().isEmpty()) {
            all = campaignService.findByNameContaining(q.trim());
        } else if (status != null) {
            all = campaignService.findByStatus(status);
        } else if (segmentId != null) {
            all = campaignService.findBySegmentId(segmentId);
        } else if (fromStr != null && toStr != null) {
            LocalDate from = LocalDate.parse(fromStr);
            LocalDate to = LocalDate.parse(toStr);
            all = campaignService.findByDateRange(from, to);
        } else {
            all = campaignService.findAll();
        }

        return all.stream()
                .sorted(Comparator.comparing(Campaign::getCreatedAt).reversed())
                .map(CampaignResponse::from)
                .toList();
    }

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<CampaignResponse> get(@PathVariable Long id) {
        return campaignService.findById(id)
                .map(CampaignResponse::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /* ======= Create ======= */

    @PostMapping
    public ResponseEntity<CampaignResponse> create(@RequestBody CampaignUpsertRequest req) {
        validate(req);

        Campaign c = new Campaign();
        c.setName(req.name().trim());
        c.setStatus(req.status());
        c.setBudget(new BigDecimal(req.budget()));
        c.setStartDate(LocalDate.parse(req.startDate()));
        c.setEndDate(LocalDate.parse(req.endDate()));
        c.setSegmentId(req.segmentId());

        if (!segmentRepo.existsById(req.segmentId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "segmentId not found: " + req.segmentId());
        }

        if (c.getEndDate().isBefore(c.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "endDate must be >= startDate");
        }

        Campaign saved = campaignService.createCampaign(c);
        return ResponseEntity.status(HttpStatus.CREATED).body(CampaignResponse.from(saved));
    }

    /* ======= Update ======= */

    @PutMapping("/{id:\\d+}")
    public ResponseEntity<CampaignResponse> update(@PathVariable Long id, @RequestBody CampaignUpsertRequest req) {
        validate(req);

        Campaign c = new Campaign();
        c.setName(req.name().trim());
        c.setStatus(req.status());
        c.setBudget(new BigDecimal(req.budget()));
        c.setStartDate(LocalDate.parse(req.startDate()));
        c.setEndDate(LocalDate.parse(req.endDate()));
        c.setSegmentId(req.segmentId());

        if (!segmentRepo.existsById(req.segmentId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "segmentId not found: " + req.segmentId());
        }

        if (c.getEndDate().isBefore(c.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "endDate must be >= startDate");
        }

        Campaign saved = campaignService.updateCampaign(id, c);
        return ResponseEntity.ok(CampaignResponse.from(saved));
    }

    /* ======= Delete ======= */

    @DeleteMapping("/{id:\\d+}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.noContent().build();
    }

    /* ======= Utility ======= */

    /**
     * 기간이 지난 캠페인 상태를 수동으로 업데이트
     */
    @PostMapping("/update-expired")
    public ResponseEntity<String> updateExpiredCampaigns() {
        try {
            campaignService.manuallyUpdateExpiredCampaigns();
            return ResponseEntity.ok("Expired campaigns updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update expired campaigns: " + e.getMessage());
        }
    }

    /* ======= validate ======= */

    private void validate(CampaignUpsertRequest req) {
        if (req.name() == null || req.name().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "name is required");
        }
        if (req.status() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "status is required");
        }
        try { new BigDecimal(req.budget()); }
        catch (Exception e) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid budget"); }

        try { LocalDate.parse(req.startDate()); }
        catch (Exception e) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid startDate"); }

        try { LocalDate.parse(req.endDate()); }
        catch (Exception e) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid endDate"); }

        if (req.segmentId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "segmentId is required");
        }
    }
}