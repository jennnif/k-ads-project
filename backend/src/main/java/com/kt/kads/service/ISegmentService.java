package com.kt.kads.service;

import com.kt.kads.entity.Segment;
import java.util.List;
import java.util.Optional;

public interface ISegmentService {
    
    /**
     * ID로 세그먼트 조회
     */
    Optional<Segment> findById(Long id);
    
    /**
     * 모든 세그먼트 조회
     */
    List<Segment> findAll();
    
    /**
     * 부모 세그먼트만 조회 (루트 세그먼트)
     */
    List<Segment> findParentSegments();
    
    /**
     * 특정 세그먼트의 자식 세그먼트들 조회
     */
    List<Segment> findChildrenByParentId(Long parentId);
    
    /**
     * 이름으로 검색 (대소문자 무시)
     */
    List<Segment> searchByName(String keyword);
    
    /**
     * 세그먼트 존재 여부 확인
     */
    boolean existsById(Long id);
    
    /**
     * 세그먼트 생성
     */
    Segment createSegment(String name, Long parentId);
    
    /**
     * 세그먼트 수정
     */
    Segment updateSegment(Long id, String name, Long parentId);
    
    /**
     * 세그먼트 삭제
     */
    void deleteSegment(Long id);
}
