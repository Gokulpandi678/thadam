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
@Table(schema = "thadam", name = "customer_logs")
public class CustomerLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false, length = 255)
    private String userId;

    @Column(name = "customer_id", nullable = false)
    private UUID customerId;

    @Column(name = "type", nullable = false, length = 100)
    private String type;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "duration", length = 50)
    private String duration;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}