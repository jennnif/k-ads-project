package com.kt.kads.kpi;

import com.kt.kads.campaign.Campaign;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "kpi_aggregates",
       indexes = { @Index(columnList = "campaign_id, aggregationDate, period") })
public class KpiAggregate {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;

    @NotNull
    private LocalDate aggregationDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 4, nullable = false)
    private PeriodBucket period; // AM / PM

    @PositiveOrZero
    private long impressions;

    @PositiveOrZero
    private long clicks;

    @PositiveOrZero
    private long conversions;

    @NotNull
    @PositiveOrZero
    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal spend = BigDecimal.ZERO;

    // getters/setters
    public Long getId() { return id; }
    public Campaign getCampaign() { return campaign; }
    public LocalDate getAggregationDate() { return aggregationDate; }
    public PeriodBucket getPeriod() { return period; }
    public long getImpressions() { return impressions; }
    public long getClicks() { return clicks; }
    public long getConversions() { return conversions; }
    public BigDecimal getSpend() { return spend; }

    public void setId(Long id) { this.id = id; }
    public void setCampaign(Campaign campaign) { this.campaign = campaign; }
    public void setAggregationDate(LocalDate aggregationDate) { this.aggregationDate = aggregationDate; }
    public void setPeriod(PeriodBucket period) { this.period = period; }
    public void setImpressions(long impressions) { this.impressions = impressions; }
    public void setClicks(long clicks) { this.clicks = clicks; }
    public void setConversions(long conversions) { this.conversions = conversions; }
    public void setSpend(BigDecimal spend) { this.spend = spend; }
}
