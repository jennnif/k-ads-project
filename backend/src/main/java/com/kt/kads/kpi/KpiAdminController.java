package com.kt.kads.kpi;

import com.kt.kads.campaign.Campaign;
import com.kt.kads.campaign.CampaignRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/kpi")
public class KpiAdminController {

    private final KpiAggregateRepository repo;
    private final CampaignRepository campaignRepo;

    public KpiAdminController(KpiAggregateRepository repo, CampaignRepository campaignRepo) {
        this.repo = repo;
        this.campaignRepo = campaignRepo;
    }

    // 1) 입력(하루/AM·PM 한 버킷)
    @PostMapping
    public KpiResponse create(@Valid @RequestBody KpiCreateRequest req) {
        Campaign c = campaignRepo.findById(req.campaignId())
                .orElseThrow(() -> new EntityNotFoundException("Campaign not found: id=" + req.campaignId()));

        KpiAggregate k = new KpiAggregate();
        k.setCampaign(c);
        k.setAggregationDate(req.date());
        k.setPeriod(req.period());
        k.setImpressions(req.impressions());
        k.setClicks(req.clicks());
        k.setConversions(req.conversions());
        k.setSpend(req.spend());

        return KpiResponse.from(repo.save(k));
    }

    // 2) 구간 조회(리스트)
    @GetMapping("/range")
    public List<KpiResponse> range(
            @RequestParam Long campaignId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return repo.findByCampaignIdAndAggregationDateBetween(campaignId, from, to)
                .stream().map(KpiResponse::from).toList();
    }

    // 3) 요약 합계(노출/클릭/전환/비용) — 자바에서 안전 합산
    @GetMapping("/summary")
    public KpiSummaryResponse summary(
            @RequestParam Long campaignId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        var list = repo.findByCampaignIdAndAggregationDateBetween(campaignId, from, to);

        long impressions = list.stream().mapToLong(KpiAggregate::getImpressions).sum();
        long clicks      = list.stream().mapToLong(KpiAggregate::getClicks).sum();
        long conversions = list.stream().mapToLong(KpiAggregate::getConversions).sum();

        BigDecimal spend = list.stream()
                .map(k -> k.getSpend() == null ? BigDecimal.ZERO : k.getSpend())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new KpiSummaryResponse(impressions, clicks, conversions, spend);
    }

    // ===== DTOs =====
    public record KpiCreateRequest(
            @NotNull Long campaignId,
            @NotNull @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @NotNull PeriodBucket period,
            @PositiveOrZero long impressions,
            @PositiveOrZero long clicks,
            @PositiveOrZero long conversions,
            @NotNull @PositiveOrZero BigDecimal spend
    ) {}

    public record KpiResponse(
            Long id, Long campaignId, LocalDate date, PeriodBucket period,
            long impressions, long clicks, long conversions, BigDecimal spend
    ) {
        public static KpiResponse from(KpiAggregate k) {
            return new KpiResponse(
                    k.getId(),
                    k.getCampaign() == null ? null : k.getCampaign().getId(),
                    k.getAggregationDate(),
                    k.getPeriod(),
                    k.getImpressions(),
                    k.getClicks(),
                    k.getConversions(),
                    k.getSpend()
            );
        }
    }

    public record KpiSummaryResponse(
            long impressions, long clicks, long conversions, BigDecimal spend
    ) {}
}
