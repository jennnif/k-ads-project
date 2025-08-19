package com.kt.kads.message;

import com.kt.kads.campaign.Campaign;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "ad_messages")
public class AdMessage {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;

    @NotBlank
    @Column(nullable = false, length = 1000)
    private String content;

    // getters/setters
    public Long getId() { return id; }
    public Campaign getCampaign() { return campaign; }
    public String getContent() { return content; }
    public void setId(Long id) { this.id = id; }
    public void setCampaign(Campaign campaign) { this.campaign = campaign; }
    public void setContent(String content) { this.content = content; }
}
