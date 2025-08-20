package com.kt.kads.segment;

import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SegmentService {
    private final SegmentRepository repository;

    public SegmentService(SegmentRepository repository) {
        this.repository = repository;
    }

    public Optional<Segment> findById(Long id) {
        return repository.findById(id);
    }
}
