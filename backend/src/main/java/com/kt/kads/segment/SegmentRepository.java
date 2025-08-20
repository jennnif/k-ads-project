package com.kt.kads.segment;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SegmentRepository extends JpaRepository<Segment, Long> {
    List<Segment> findByParentIdIsNull();
    List<Segment> findByParentId(Long parentId); // 추가
}
