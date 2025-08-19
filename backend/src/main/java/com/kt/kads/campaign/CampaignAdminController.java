package com.kt.kads.campaign;

import com.kt.kads.segment.Segment;
import com.kt.kads.segment.SegmentRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping
    public CampaignResponse create(@Valid @RequestBody CampaignCreateRequest req) {
        Segment segment = segmentRepo.findById(req.segmentId())
                .orElseThrow(() -> new EntityNotFoundException("Segment not found: id=" + req.segmentId()));
        Campaign c = new Campaign();
        c.setName(req.name().trim());
        c.setSegment(segment);
        return CampaignResponse.from(repo.save(c));
    }

    @GetMapping
    public List<CampaignResponse> list(@RequestParam(required = false) String q) {
        var list = (q == null || q.isBlank())
                ? repo.findAll()
                : repo.findByNameContainingIgnoreCase(q.trim());
        return list.stream().map(CampaignResponse::from).toList();
    }

    // DTOs
    public record CampaignCreateRequest(@NotBlank String name, @NotNull Long segmentId) {}
    public record CampaignResponse(Long id, String name, Long segmentId) {
        public static CampaignResponse from(Campaign c) {
            return new CampaignResponse(
                    c.getId(),
                    c.getName(),
                    c.getSegment() == null ? null : c.getSegment().getId()
            );
        }
    }
}
