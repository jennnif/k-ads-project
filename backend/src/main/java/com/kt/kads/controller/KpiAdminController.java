package com.kt.kads.controller;

import com.kt.kads.entity.KpiAggregate;
import com.kt.kads.repository.KpiAggregateRepository;
import com.kt.kads.entity.Campaign;
import com.kt.kads.repository.CampaignRepository;
import com.kt.kads.entity.Message;
import com.kt.kads.repository.MessageRepository;
import com.kt.kads.enums.PeriodBucket;
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
    private final MessageRepository messageRepo;

    public KpiAdminController(KpiAggregateRepository repo, CampaignRepository campaignRepo, MessageRepository messageRepo) {
        this.repo = repo;
        this.campaignRepo = campaignRepo;
        this.messageRepo = messageRepo;
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

    // 4) 실제 메시지 기반 대시보드 KPI
    @GetMapping("/dashboard")
    public KpiDashboardResponse dashboard(@RequestParam(required = false) Long campaignId) {
        if (campaignId != null) {
            return calculateKpiForCampaign(campaignId);
        }
        return calculateOverallKpi();
    }

    @GetMapping("/messages-performance")  
    public List<MessagePerformanceResponse> messagesPerformance(@RequestParam(required = false) Long campaignId) {
        List<Message> messages;
        if (campaignId != null) {
            messages = messageRepo.findByCampaignId(campaignId);
        } else {
            messages = messageRepo.findAll();
        }
        
        return messages.stream()
                .map(this::calculateMessagePerformance)
                .toList();
    }

    // 5) 캠페인별 성과 데이터
    @GetMapping("/campaigns-performance")
    public List<CampaignPerformanceResponse> campaignsPerformance() {
        return campaignRepo.findAll().stream()
                .map(this::calculateCampaignPerformance)
                .toList();
    }

    private KpiDashboardResponse calculateOverallKpi() {
        List<Message> allMessages = messageRepo.findAll();
        
        long totalSent = allMessages.stream()
                .filter(m -> m.getStatus() == Message.Status.SENT)
                .count();
        
        long totalClicks = (long) (totalSent * 0.254); // 25.4% CTR 가정
        long totalConversions = (long) (totalClicks * 0.257); // 25.7% CVR 가정
        BigDecimal totalCost = allMessages.stream()
                .filter(m -> m.getStatus() == Message.Status.SENT)
                .map(this::calculateMessageCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return new KpiDashboardResponse(totalSent, totalClicks, totalConversions, totalCost);
    }

    private KpiDashboardResponse calculateKpiForCampaign(Long campaignId) {
        List<Message> campaignMessages = messageRepo.findByCampaignId(campaignId);
        
        long sent = campaignMessages.stream()
                .filter(m -> m.getStatus() == Message.Status.SENT)
                .count();
        
        long clicks = (long) (sent * 0.254);
        long conversions = (long) (clicks * 0.257);
        BigDecimal cost = campaignMessages.stream()
                .filter(m -> m.getStatus() == Message.Status.SENT)
                .map(this::calculateMessageCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return new KpiDashboardResponse(sent, clicks, conversions, cost);
    }

    private CampaignPerformanceResponse calculateCampaignPerformance(Campaign campaign) {
        List<Message> campaignMessages = messageRepo.findByCampaignId(campaign.getId());
        
        long sent = campaignMessages.stream()
                .filter(m -> m.getStatus() == Message.Status.SENT)
                .count();
        
        long clicks = (long) (sent * 0.254);
        long conversions = (long) (clicks * 0.257);
        BigDecimal cost = campaignMessages.stream()
                .filter(m -> m.getStatus() == Message.Status.SENT)
                .map(this::calculateMessageCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return new CampaignPerformanceResponse(
                campaign.getId(), campaign.getName(), sent, clicks, conversions, cost
        );
    }

    private BigDecimal calculateMessageCost(Message message) {
        // 메시지 타입별 비용 계산
        return switch (message.getType()) {
            case SMS -> new BigDecimal("20");
            case MMS -> new BigDecimal("50");
            case RCS -> new BigDecimal("100");
        };
    }

    private MessagePerformanceResponse calculateMessagePerformance(Message message) {
        // 메시지별 임시 성과 계산 (실제로는 message_kpi 테이블에서 조회해야 함)
        long impressions = message.getStatus() == Message.Status.SENT ? 1 : 0;
        long clicks = (long) (impressions * 0.254);
        long conversions = (long) (clicks * 0.257);
        BigDecimal cost = calculateMessageCost(message);
        
        return new MessagePerformanceResponse(
                message.getId(), 
                message.getCampaignId(),
                message.getTitle(),
                message.getType().toString(),
                impressions, 
                clicks, 
                conversions, 
                cost
        );
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

    public record KpiDashboardResponse(
            long totalSent, long totalClicks, long totalConversions, BigDecimal totalCost
    ) {}

    public record CampaignPerformanceResponse(
            Long campaignId, String campaignName, long sent, long clicks, long conversions, BigDecimal cost
    ) {}

    public record MessagePerformanceResponse(
            Long messageId, Long campaignId, String title, String type, 
            long impressions, long clicks, long conversions, BigDecimal cost
    ) {}
}
