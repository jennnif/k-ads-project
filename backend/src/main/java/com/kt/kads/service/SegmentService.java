package com.kt.kads.service;

import com.kt.kads.entity.Segment;
import com.kt.kads.repository.SegmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class SegmentService implements ISegmentService {

    private final SegmentRepository segmentRepository;

    public SegmentService(SegmentRepository segmentRepository) {
        this.segmentRepository = segmentRepository;
    }

    /**
     * ID로 세그먼트 조회
     */
    public Optional<Segment> findById(Long id) {
        return segmentRepository.findById(id);
    }

    /**
     * 모든 세그먼트 조회
     */
    public List<Segment> findAll() {
        return segmentRepository.findAll();
    }

    /**
     * 부모 세그먼트만 조회 (루트 세그먼트)
     */
    public List<Segment> findParentSegments() {
        return segmentRepository.findByParentIdIsNull();
    }

    /**
     * 특정 세그먼트의 자식 세그먼트들 조회
     */
    public List<Segment> findChildrenByParentId(Long parentId) {
        return segmentRepository.findByParentId(parentId);
    }

    /**
     * 이름으로 검색 (대소문자 무시)
     */
    public List<Segment> searchByName(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return findAll();
        }
        return segmentRepository.findByNameIgnoreCaseContaining(keyword.trim());
    }

    /**
     * 세그먼트 존재 여부 확인
     */
    public boolean existsById(Long id) {
        return segmentRepository.existsById(id);
    }

    /**
     * 세그먼트 생성
     */
    @Transactional
    public Segment createSegment(String name, Long parentId) {
        // 유효성 검증
        validateSegmentName(name);
        validateParentId(parentId);

        Segment segment = new Segment();
        segment.setName(name.trim());
        segment.setParentId(parentId);

        return segmentRepository.save(segment);
    }

    /**
     * 세그먼트 수정
     */
    @Transactional
    public Segment updateSegment(Long id, String name, Long parentId) {
        Segment segment = findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Segment not found: " + id));

        // 유효성 검증
        validateSegmentName(name);
        validateParentIdForUpdate(id, parentId);

        segment.setName(name.trim());
        segment.setParentId(parentId);

        return segmentRepository.save(segment);
    }

    /**
     * 세그먼트 삭제
     */
    @Transactional
    public void deleteSegment(Long id) {
        Segment segment = findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Segment not found: " + id));

        // 자식 세그먼트가 있는지 확인
        long childrenCount = segmentRepository.countByParentId(id);
        if (childrenCount > 0) {
            throw new IllegalStateException("Cannot delete segment: children exist");
        }

        segmentRepository.delete(segment);
    }

    /**
     * 세그먼트 계층 구조 조회 (트리 형태)
     */
    public List<Segment> getSegmentTree() {
        List<Segment> rootSegments = findParentSegments();
        // 여기서 재귀적으로 자식들을 로드할 수 있음
        return rootSegments;
    }

    /**
     * 세그먼트 이름 유효성 검증
     */
    private void validateSegmentName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Segment name is required");
        }
        if (name.trim().length() > 200) {
            throw new IllegalArgumentException("Segment name too long (max 200 characters)");
        }
    }

    /**
     * 부모 ID 유효성 검증 (생성 시)
     */
    private void validateParentId(Long parentId) {
        if (parentId != null && !existsById(parentId)) {
            throw new IllegalArgumentException("Parent segment not found: " + parentId);
        }
    }

    /**
     * 부모 ID 유효성 검증 (수정 시)
     */
    private void validateParentIdForUpdate(Long segmentId, Long parentId) {
        if (parentId != null) {
            if (parentId.equals(segmentId)) {
                throw new IllegalArgumentException("Cannot set parent to itself");
            }
            if (!existsById(parentId)) {
                throw new IllegalArgumentException("Parent segment not found: " + parentId);
            }
            // 순환 참조 방지 로직 (필요시 추가)
        }
    }
}