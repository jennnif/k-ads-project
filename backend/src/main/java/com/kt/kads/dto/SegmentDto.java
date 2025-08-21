package com.kt.kads.dto;

import com.kt.kads.entity.Segment;

public class SegmentDto {
    
    public record SegmentResponse(Long id, String name, Long parentId) {
        public static SegmentResponse from(Segment s) {
            return new SegmentResponse(s.getId(), s.getName(), s.getParentId());
        }
    }
    
    public record SegmentCreateRequest(String name, Long parentId) {}
    
    public record SegmentUpdateRequest(String name, Long parentId) {}
}