package entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(schema = "thadam", name = "clients")
public class ClientEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    // Link back to the customers table — the source of truth for contact info
    @Column(name = "customer_id", nullable = false, unique = true)
    private UUID customerId;

    // Owner — which user performed the conversion
    @Column(name = "owner_id", nullable = false, length = 255)
    private String ownerId;

    // ── Relationship Details ───────────────────────────────────
    // e.g. "Freelance client", "Business partner", "Employer", "Referral partner", "Retainer client"
    @Column(name = "client_type", nullable = false, length = 100)
    private String clientType;

    @Column(name = "client_since")
    private LocalDate clientSince;

    // Short description: how they became a client
    @Column(name = "conversion_reason", columnDefinition = "text")
    private String conversionReason;

    // ── Value Tags ────────────────────────────────────────────
    // Stored as comma-separated values e.g. "Jobs / work,Referrals,Partnership"
    @Column(name = "value_tags", columnDefinition = "text")
    private String valueTags;

    // ── Engagement ────────────────────────────────────────────
    // e.g. "One-time", "Ongoing", "Contract-based", "As needed"
    @Column(name = "engagement_type", length = 100)
    private String engagementType;

    @Column(name = "next_follow_up")
    private LocalDate nextFollowUp;

    // ── Notes ─────────────────────────────────────────────────
    @Column(name = "notes", columnDefinition = "text")
    private String notes;

    // ── Timestamps ────────────────────────────────────────────
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}