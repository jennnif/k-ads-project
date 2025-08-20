package com.kt.kads.segment;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/segments")
public class SegmentAdminController {

    private final SegmentRepository repo;
    private final SegmentService service;

    public SegmentAdminController(SegmentRepository repo, SegmentService service) {
        this.repo = repo;
        this.service = service;
    }

    /**
     * 전체 세그먼트 목록
     * GET /api/admin/segments
     */
    @GetMapping
    public List<SegmentResponse> all() {
        return repo.findAll()
                .stream()
                .map(SegmentResponse::from)
                .toList();
    }

    /**
     * 부모(루트) 세그먼트 목록
     * GET /api/admin/segments/parents
     */
    @GetMapping("/parents")
    public List<SegmentResponse> parents() {
        return repo.findByParentIdIsNull()
                .stream()
                .map(SegmentResponse::from)
                .toList();
    }

    /**
     * 단일 세그먼트 조회
     * GET /api/admin/segments/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<SegmentResponse> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(SegmentResponse::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 특정 세그먼트의 자식 목록
     * GET /api/admin/segments/{id}/children
     */
    @GetMapping("/{id}/children")
    public List<SegmentResponse> children(@PathVariable Long id) {
        return repo.findByParentId(id)
                .stream()
                .map(SegmentResponse::from)
                .toList();
    }

    // 응답 DTO
    public record SegmentResponse(Long id, String name, Long parentId) {
        public static SegmentResponse from(Segment s) {
            return new SegmentResponse(s.getId(), s.getName(), s.getParentId());
        }
    }
}
