package com.kt.kads.message;

import com.kt.kads.campaign.Campaign;
import com.kt.kads.campaign.CampaignRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/messages")
public class AdMessageAdminController {

    private final AdMessageRepository repo;
    private final CampaignRepository campaignRepo;

    public AdMessageAdminController(AdMessageRepository repo, CampaignRepository campaignRepo) {
        this.repo = repo;
        this.campaignRepo = campaignRepo;
    }

    @PostMapping
    public MessageResponse create(@Valid @RequestBody MessageCreateRequest req) {
        Campaign c = campaignRepo.findById(req.campaignId())
                .orElseThrow(() -> new EntityNotFoundException("Campaign not found: id=" + req.campaignId()));
        AdMessage m = new AdMessage();
        m.setCampaign(c);
        m.setContent(req.content().trim());
        return MessageResponse.from(repo.save(m));
    }

    @GetMapping("/by-campaign")
    public List<MessageResponse> listByCampaign(@RequestParam Long campaignId) {
        return repo.findByCampaignId(campaignId).stream().map(MessageResponse::from).toList();
    }

    // DTOs
    public record MessageCreateRequest(@NotNull Long campaignId, @NotBlank String content) {}
    public record MessageResponse(Long id, Long campaignId, String content) {
        public static MessageResponse from(AdMessage m) {
            return new MessageResponse(m.getId(),
                    m.getCampaign() == null ? null : m.getCampaign().getId(),
                    m.getContent());
        }
    }
}
