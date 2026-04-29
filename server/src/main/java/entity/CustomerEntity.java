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
@Table(schema = "thadam", name = "customers")
public class CustomerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    // Owner — which user created this customer
    @Column(name = "owner_id", nullable = false, length = 255)
    private String ownerId;

    // ── Personal Info ─────────────────────────────────────────
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(name = "profile_picture", columnDefinition = "text")
    private String profilePicture;

    // ── Contact Info ──────────────────────────────────────────
    @Column(name = "primary_email", length = 255)
    private String primaryEmail;

    @Column(name = "secondary_email", length = 255)
    private String secondaryEmail;

    @Column(name = "primary_contact_no", length = 20)
    private String primaryContactNo;

    @Column(name = "secondary_contact_no", length = 20)
    private String secondaryContactNo;

    // ── Professional Info ─────────────────────────────────────
    @Column(name = "role", length = 100)
    private String role;

    @Column(name = "designation", length = 255)
    private String designation;

    @Column(name = "company", length = 255)
    private String company;

    // ── Address ───────────────────────────────────────────────
    @Column(name = "address_street", length = 255)
    private String addressStreet;

    @Column(name = "address_number", length = 50)
    private String addressNumber;

    @Column(name = "address_postcode", length = 20)
    private String addressPostcode;

    @Column(name = "address_city", length = 100)
    private String addressCity;

    @Column(name = "address_state", length = 100)
    private String addressState;

    @Column(name = "address_country", length = 100)
    private String addressCountry;

    // ── Social Media ──────────────────────────────────────────
    @Column(name = "social_linkedin", length = 255)
    private String socialLinkedin;

    @Column(name = "social_twitter", length = 255)
    private String socialTwitter;

    @Column(name = "social_youtube", length = 255)
    private String socialYoutube;

    // ── Tracking ──────────────────────────────────────────────
    @Column(name = "last_contacted_date")
    private LocalDate lastContactedDate;

    @Column(name = "referred_by", length = 255)
    private String referredBy;

    // ── Soft Delete ───────────────────────────────────────────
    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;

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