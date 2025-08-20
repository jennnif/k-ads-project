package com.kt.kads.message;

import com.kt.kads.campaign.CampaignRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/admin/messages")
public class MessageAdminController {

    private final MessageRepository repo;
    private final CampaignRepository campaignRepo;

    public MessageAdminController(MessageRepository repo, CampaignRepository campaignRepo) {
        this.repo = repo;
        this.campaignRepo = campaignRepo;
    }

    /* ====== Read ====== */

    @GetMapping
    public List<MessageResponse> list(
            @RequestParam(name="q", required=false) String q,
            @RequestParam(name="type", required=false) Message.Type type,
            @RequestParam(name="status", required=false) Message.Status status,
            @RequestParam(name="campaignId", required=false) Long campaignId
    ) {
        List<Message> all;

        if (q != null && !q.trim().isEmpty()) {
            all = repo.findByTitleIgnoreCaseContaining(q.trim());
        } else if (type != null) {
            all = repo.findByType(type);
        } else if (status != null) {
            all = repo.findByStatus(status);
        } else if (campaignId != null) {
            all = repo.findByCampaignId(campaignId);
        } else {
            all = repo.findAll();
        }

        return all.stream()
                .sorted(Comparator.comparing(Message::getCreatedAt).reversed())
                .map(MessageResponse::from)
                .toList();
    }

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<MessageResponse> get(@PathVariable Long id) {
        return repo.findById(id)
                .map(MessageResponse::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /* ====== Create ====== */

    @PostMapping
    public ResponseEntity<MessageResponse> create(@RequestBody MessageUpsertRequest req) {
        validate(req);

        if (!campaignRepo.existsById(req.campaignId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "campaignId not found: " + req.campaignId());
        }

        Message m = new Message();
        Message saved = repo.save(toEntity(m, req));
        return ResponseEntity.status(HttpStatus.CREATED).body(MessageResponse.from(saved));
    }

    /* ====== Update ====== */

    @PutMapping("/{id:\\d+}")
    public ResponseEntity<MessageResponse> update(@PathVariable Long id, @RequestBody MessageUpsertRequest req) {
        validate(req);

        Message m = repo.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "message not found: " + id));

        if (!campaignRepo.existsById(req.campaignId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "campaignId not found: " + req.campaignId());
        }

        Message saved = repo.save(toEntity(m, req));
        return ResponseEntity.ok(MessageResponse.from(saved));
    }

    /* ====== Delete ====== */

    @DeleteMapping("/{id:\\d+}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        var it = repo.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "message not found: " + id));
        repo.delete(it);
        return ResponseEntity.noContent().build();
    }

    /* ====== DTO/validate/mapping ====== */

    public record MessageUpsertRequest(
            Long campaignId,
            Message.Type type,
            String title,
            String content,
            Message.Status status
    ) {}

    public record MessageResponse(
            Long id, Long campaignId, Message.Type type,
            String title, String content, Message.Status status,
            String createdAt, String updatedAt
    ) {
        public static MessageResponse from(Message m) {
            return new MessageResponse(
                    m.getId(), m.getCampaignId(), m.getType(),
                    m.getTitle(), m.getContent(), m.getStatus(),
                    m.getCreatedAt().toString(), m.getUpdatedAt().toString()
            );
        }
    }

    private void validate(MessageUpsertRequest req) {
        if (req.campaignId() == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "campaignId is required");
        if (req.type() == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "type is required");
        if (req.status() == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "status is required");
        if (req.title() == null || req.title().trim().isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "title is required");
        if (req.title().trim().length() > 100) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "title too long (max 100)");
        if (req.content() == null || req.content().trim().isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "content is required");
        if (req.content().trim().length() > 2000) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "content too long (max 2000)");
    }

    private Message toEntity(Message m, MessageUpsertRequest req) {
        m.setCampaignId(req.campaignId());
        m.setType(req.type());
        m.setTitle(req.title().trim());
        m.setContent(req.content().trim());
        m.setStatus(req.status());
        return m;
    }
}
