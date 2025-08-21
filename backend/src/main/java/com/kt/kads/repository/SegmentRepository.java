package com.kt.kads.repository;

import com.kt.kads.entity.Segment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SegmentRepository extends JpaRepository<Segment, Long> {
    List<Segment> findByParentIdIsNull();
    List<Segment> findByParentId(Long parentId);

    // 검색: 이름 부분 일치, 대소문자 무시
    List<Segment> findByNameIgnoreCaseContaining(String q);

    // 자식 존재 여부 체크(삭제 제약에 사용)
    long countByParentId(Long parentId);
}
