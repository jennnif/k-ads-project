package com.kt.kads.controller;

import com.kt.kads.entity.Segment;
import com.kt.kads.repository.SegmentRepository;
import com.kt.kads.service.SegmentService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

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

    /* =========================
     * Read: 목록/단일/부모/자식
     * ========================= */

    /** 전체 세그먼트 목록 */
    @GetMapping
    public List<SegmentResponse> all() {
        return repo.findAll().stream().map(SegmentResponse::from).toList();
    }

    /** 부모(루트) 세그먼트 목록 */
    @GetMapping("/parents")
    public List<SegmentResponse> parents() {
        return repo.findByParentIdIsNull().stream().map(SegmentResponse::from).toList();
    }

    /** 단일 조회 (숫자만 매칭) */
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<SegmentResponse> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(SegmentResponse::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** 특정 세그먼트의 자식 목록 (숫자만 매칭) */
    @GetMapping("/{id:\\d+}/children")
    public List<SegmentResponse> children(@PathVariable Long id) {
        return repo.findByParentId(id).stream().map(SegmentResponse::from).toList();
    }

    /** 이름 부분 일치(대소문자 무시) 검색 */
    @GetMapping("/search")
    public List<SegmentResponse> search(@RequestParam(name = "q", required = false) String q) {
        String keyword = (q == null) ? "" : q.trim();
        if (keyword.isEmpty()) {
            return repo.findAll().stream().map(SegmentResponse::from).toList();
        }
        return repo.findByNameIgnoreCaseContaining(keyword).stream().map(SegmentResponse::from).toList();
    }

    /* =========================
     * Create / Update / Delete
     * ========================= */

    /** 생성 */
    @PostMapping
    public ResponseEntity<SegmentResponse> create(@RequestBody SegmentCreateRequest req,
                                                  UriComponentsBuilder ucb) {
        // name 유효성
        if (req.name() == null || req.name().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "name is required");
        }
        String name = req.name().trim();
        if (name.length() > 200) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "name too long (max 200)");
        }

        // parentId 유효성
        Long parentId = req.parentId();
        if (parentId != null && !repo.existsById(parentId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "parentId not found: " + parentId);
        }

        Segment s = new Segment();
        s.setName(name);
        s.setParentId(parentId);

        Segment saved = repo.save(s);

        var location = ucb.path("/api/admin/segments/{id}")
                .buildAndExpand(saved.getId())
                .toUri();

        return ResponseEntity
                .created(location)
                .header(HttpHeaders.LOCATION, location.toString())
                .body(SegmentResponse.from(saved));
    }

    /** 수정 (이름/부모 변경) */
    @PutMapping("/{id:\\d+}")
    public ResponseEntity<SegmentResponse> update(@PathVariable Long id,
                                                  @RequestBody SegmentUpdateRequest req) {
        var seg = repo.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "segment not found: " + id));

        if (req.name() == null || req.name().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "name is required");
        }
        String name = req.name().trim();
        if (name.length() > 200) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "name too long (max 200)");
        }

        Long parentId = req.parentId();
        if (parentId != null) {
            if (parentId.equals(id)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "cannot set parent to itself");
            }
            if (!repo.existsById(parentId)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "parentId not found: " + parentId);
            }
            // (옵션) 순환 방지 로직 필요 시 추가 가능
        }

        seg.setName(name);
        seg.setParentId(parentId);
        var saved = repo.save(seg);

        return ResponseEntity.ok(SegmentResponse.from(saved));
    }

    /** 삭제 (자식 존재 시 409) */
    @DeleteMapping("/{id:\\d+}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        var seg = repo.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "segment not found: " + id));

        long children = repo.countByParentId(id);
        if (children > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "cannot delete: children exist");
        }

        repo.delete(seg);
        return ResponseEntity.noContent().build();
    }

    /* =========================
     * DTOs
     * ========================= */
    public record SegmentResponse(Long id, String name, Long parentId) {
        public static SegmentResponse from(Segment s) {
            return new SegmentResponse(s.getId(), s.getName(), s.getParentId());
        }
    }
    public record SegmentCreateRequest(String name, Long parentId) {}
    public record SegmentUpdateRequest(String name, Long parentId) {}
}
