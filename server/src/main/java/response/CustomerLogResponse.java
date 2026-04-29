package response;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CustomerLogResponse {

    private UUID id;

    // ── Relations ─────────────────────────────────────────────
    private String userId;

    private UUID customerId;

    // ── Log Info ──────────────────────────────────────────────
    private String title;

    private String type;
    private String duration;

    private String description;

    // ── Timestamps ────────────────────────────────────────────
    private LocalDateTime createdAt;
}