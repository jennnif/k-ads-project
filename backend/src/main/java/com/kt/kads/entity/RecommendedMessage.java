package com.kt.kads.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "recommended_messages")
public class RecommendedMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "text")
    private String content;

    private String category;          // ex) 장바구니, 재구매, ...
    private String tone;              // ex) 친근, 긴급, 정보
    private String channel;           // ex) SMS, MMS
    private String language;          // ex) ko

    private Integer weight;           // 가중치
    private Boolean isActive;

    private OffsetDateTime createdAt;

    // getters & setters
    public Long getId() { return id; }
    public String getContent() { return content; }
    public String getCategory() { return category; }
    public String getTone() { return tone; }
    public String getChannel() { return channel; }
    public String getLanguage() { return language; }
    public Integer getWeight() { return weight; }
    public Boolean getIsActive() { return isActive; }
    public OffsetDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setContent(String content) { this.content = content; }
    public void setCategory(String category) { this.category = category; }
    public void setTone(String tone) { this.tone = tone; }
    public void setChannel(String channel) { this.channel = channel; }
    public void setLanguage(String language) { this.language = language; }
    public void setWeight(Integer weight) { this.weight = weight; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
