package response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClientResponse {

    // ── Client table fields ───────────────────────────────────────────────────
    private UUID id;                    // clients.id
    private UUID customerId;            // FK back to customers

    private String clientType;
    private LocalDate clientSince;
    private String conversionReason;
    private List<String> valueTags;     // split from comma-separated on the way out
    private String engagementType;
    private LocalDate nextFollowUp;
    private String notes;

    // ── Customer table fields (full snapshot) ─────────────────────────────────
    // Personal
    private String firstName;
    private String lastName;
    private String profilePicture;

    // Contact
    private String primaryEmail;
    private String secondaryEmail;
    private String primaryContactNo;
    private String secondaryContactNo;

    // Professional
    private String role;
    private String designation;
    private String company;

    // Address
    private String addressStreet;
    private String addressNumber;
    private String addressPostcode;
    private String addressCity;
    private String addressState;
    private String addressCountry;

    // Social
    private String socialLinkedin;
    private String socialTwitter;
    private String socialYoutube;

    // Tracking
    private LocalDate lastContactedDate;
    private String referredBy;

    // ── Logs (only in single-fetch / detail page) ─────────────────────────────
    private List<CustomerLogResponse> logs;

    // ── Timestamps ────────────────────────────────────────────────────────────
    private LocalDateTime createdAt;    // client record created_at
    private LocalDateTime updatedAt;
}