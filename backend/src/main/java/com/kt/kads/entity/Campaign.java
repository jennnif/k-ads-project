package com.kt.kads.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "campaigns")
public class Campaign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, length=200)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false, length=20)
    private Status status = Status.DRAFT;

    @Column(precision = 16, scale = 2, nullable=false)
    private BigDecimal budget;

    @Column(nullable=false)
    private LocalDate startDate;

    @Column(nullable=false)
    private LocalDate endDate;

    @Column(nullable=false)
    private Long segmentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false, length=20)
    private ChannelType channelType = ChannelType.SMS;

    @Column(length=500)
    private String conversionGoal;

    @Column(nullable=false)
    private boolean deleted = false;

    @Column(nullable=false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(nullable=false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    @PreUpdate
    public void onUpdate() { this.updatedAt = OffsetDateTime.now(); }

    public enum Status { DRAFT, ACTIVE, PAUSED, ENDED }

    public enum ChannelType { SMS, MMS, RCS }

    // ===== getters/setters =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    // 별칭 게터: 컨트롤러 등에서 공통적으로 "제목"으로 사용할 수 있게
    public String getTitle() { return this.name; }
    // (선택) 별칭 세터도 원하면 사용 가능
    public void setTitle(String title) { this.name = title; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public BigDecimal getBudget() { return budget; }
    public void setBudget(BigDecimal budget) { this.budget = budget; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Long getSegmentId() { return segmentId; }
    public void setSegmentId(Long segmentId) { this.segmentId = segmentId; }

    public ChannelType getChannelType() { return channelType; }
    public void setChannelType(ChannelType channelType) { this.channelType = channelType; }

    public String getConversionGoal() { return conversionGoal; }
    public void setConversionGoal(String conversionGoal) { this.conversionGoal = conversionGoal; }

    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
