package com.kt.kads.segment;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "segments",
       uniqueConstraints = @UniqueConstraint(columnNames = {"name", "parent_id"}))
public class Segment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String name;

    // null이면 대분류, 있으면 중분류(Self Join)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Segment parent;

    // --- getters/setters ---
    public Long getId() { return id; }
    public String getName() { return name; }
    public Segment getParent() { return parent; }
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setParent(Segment parent) { this.parent = parent; }
}
