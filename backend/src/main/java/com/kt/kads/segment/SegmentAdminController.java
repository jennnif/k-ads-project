package com.kt.kads.segment;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/segments")
public class SegmentAdminController {

    private final SegmentRepository repo;

    public SegmentAdminController(SegmentRepository repo) {
        this.repo = repo;
    }

    // 대분류 목록
    @GetMapping("/parents")
    public List<SegmentResponse> parents() {
        return repo.findByParentIsNull().stream().map(SegmentResponse::from).toList();
    }

    // 중분류 목록
    @GetMapping("/children")
    public List<SegmentResponse> children(@RequestParam Long parentId) {
        return repo.findByParentId(parentId).stream().map(SegmentResponse::from).toList();
    }

    // 생성(대분류/중분류 공통)
    @PostMapping
    public SegmentResponse create(@Valid @RequestBody SegmentCreateRequest req) {
        Segment parent = null;
        if (req.parentId() != null) {
            parent = repo.findById(req.parentId())
                    .orElseThrow(() -> new EntityNotFoundException("Parent segment not found"));
        }
        Segment s = new Segment();
        s.setName(req.name());
        s.setParent(parent);
        return SegmentResponse.from(repo.save(s));
    }

    // --- 요청/응답 DTO ---
    public record SegmentCreateRequest(@NotBlank String name, Long parentId) {}

    public record SegmentResponse(Long id, String name, Long parentId) {
        public static SegmentResponse from(Segment s) {
            return new SegmentResponse(
                    s.getId(),
                    s.getName(),
                    s.getParent() == null ? null : s.getParent().getId()
            );
        }
    }
}
