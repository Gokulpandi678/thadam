package response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import entity.ClientEntity;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CustomerResponse {

    private UUID id;

    // ── Personal Info ─────────────────────────────────────────
    private String firstName;
    private String lastName;
    private String profilePicture;

    // ── Contact Info ──────────────────────────────────────────
    private String primaryEmail;
    private String secondaryEmail;
    private String primaryContactNo;
    private String secondaryContactNo;

    // ── Professional Info ─────────────────────────────────────
    private String role;
    private String designation;
    private String company;

    // ── Address ───────────────────────────────────────────────
    private String addressStreet;
    private String addressNumber;
    private String addressPostcode;
    private String addressCity;
    private String addressState;
    private String addressCountry;

    // ── Social Media ──────────────────────────────────────────
    private String socialLinkedin;
    private String socialTwitter;
    private String socialYoutube;

    // ── Tracking ──────────────────────────────────────────────
    private LocalDate lastContactedDate;
    private String referredBy;

    // ── Logs ──────────────────────────────────────────────────
    private List<CustomerLogResponse> logs;
    
    // client details
    private Optional<ClientEntity> client;

    // ── Timestamps ────────────────────────────────────────────
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}