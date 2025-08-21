package com.kt.kads.controller;

import com.kt.kads.entity.Campaign;
import com.kt.kads.repository.CampaignRepository;
import com.kt.kads.repository.SegmentRepository; // 부모 존재 체크 용
import com.kt.kads.dto.CampaignDto.CampaignUpsertRequest;
import com.kt.kads.dto.CampaignDto.CampaignResponse;
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

    public CampaignAdminController(CampaignRepository repo, SegmentRepository segmentRepo) {
        this.repo = repo;
        this.segmentRepo = segmentRepo;
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
            all = repo.findByNameIgnoreCaseContaining(q.trim());
        } else if (status != null) {
            all = repo.findByStatus(status);
        } else if (segmentId != null) {
            all = repo.findBySegmentId(segmentId);
        } else if (fromStr != null && toStr != null) {
            LocalDate from = LocalDate.parse(fromStr);
            LocalDate to = LocalDate.parse(toStr);
            all = repo.findByStartDateLessThanEqualAndEndDateGreaterThanEqual(to, from);
        } else {
            all = repo.findAll();
        }

        return all.stream()
                .sorted(Comparator.comparing(Campaign::getCreatedAt).reversed())
                .map(CampaignResponse::from)
                .toList();
    }

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<CampaignResponse> get(@PathVariable Long id) {
        return repo.findById(id)
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

        Campaign saved = repo.save(c);
        return ResponseEntity.status(HttpStatus.CREATED).body(CampaignResponse.from(saved));
    }

    /* ======= Update ======= */

    @PutMapping("/{id:\\d+}")
    public ResponseEntity<CampaignResponse> update(@PathVariable Long id, @RequestBody CampaignUpsertRequest req) {
        validate(req);

        Campaign c = repo.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "campaign not found: " + id));

        if (!segmentRepo.existsById(req.segmentId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "segmentId not found: " + req.segmentId());
        }

        c.setName(req.name().trim());
        c.setStatus(req.status());
        c.setBudget(new BigDecimal(req.budget()));
        c.setStartDate(LocalDate.parse(req.startDate()));
        c.setEndDate(LocalDate.parse(req.endDate()));
        c.setSegmentId(req.segmentId());

        if (c.getEndDate().isBefore(c.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "endDate must be >= startDate");
        }

        Campaign saved = repo.save(c);
        return ResponseEntity.ok(CampaignResponse.from(saved));
    }

    /* ======= Delete ======= */

    @DeleteMapping("/{id:\\d+}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        var it = repo.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "campaign not found: " + id));
        repo.delete(it);
        return ResponseEntity.noContent().build();
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