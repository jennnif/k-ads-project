package com.kt.kads.kpi;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/kpi/export")
public class KpiExportController {

    private final KpiAggregateRepository repo;

    public KpiExportController(KpiAggregateRepository repo) {
        this.repo = repo;
    }

    // 1) 구간 CSV (행 나열)
    @GetMapping(value = "/range.csv", produces = "text/csv; charset=UTF-8")
    public ResponseEntity<byte[]> rangeCsv(
            @RequestParam Long campaignId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        List<KpiAggregate> list = repo.findByCampaignIdAndAggregationDateBetween(campaignId, from, to);

        StringBuilder sb = new StringBuilder();
        sb.append("date,period,impressions,clicks,conversions,spend\n");
        for (KpiAggregate k : list) {
            sb.append(k.getAggregationDate()).append(',')
              .append(k.getPeriod()).append(',')
              .append(k.getImpressions()).append(',')
              .append(k.getClicks()).append(',')
              .append(k.getConversions()).append(',')
              .append(k.getSpend() == null ? "0" : k.getSpend().toPlainString())
              .append('\n');
        }

        return csvResponse(sb.toString(), "kpi_range_%d_%s_%s.csv".formatted(campaignId, from, to));
    }

    // 2) 요약 CSV (합계 1행)
    @GetMapping(value = "/summary.csv", produces = "text/csv; charset=UTF-8")
    public ResponseEntity<byte[]> summaryCsv(
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

        StringBuilder sb = new StringBuilder();
        sb.append("impressions,clicks,conversions,spend\n");
        sb.append(impressions).append(',')
          .append(clicks).append(',')
          .append(conversions).append(',')
          .append(spend.toPlainString()).append('\n');

        return csvResponse(sb.toString(), "kpi_summary_%d_%s_%s.csv".formatted(campaignId, from, to));
    }

    // 공통 CSV 응답
    private ResponseEntity<byte[]> csvResponse(String csv, String filename) {
        byte[] bytes = csv.getBytes(StandardCharsets.UTF_8);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("text", "csv", StandardCharsets.UTF_8));
        headers.setContentDisposition(ContentDisposition.attachment().filename(filename, StandardCharsets.UTF_8).build());
        headers.setContentLength(bytes.length);
        return ResponseEntity.ok().headers(headers).body(bytes);
    }
}
