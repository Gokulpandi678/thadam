package request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClientRequest {

    @NotBlank(message = "Client type is required")
    private String clientType;

    private LocalDate clientSince;

    private String conversionReason;

    // Comma-separated value tags e.g. "Jobs / work,Referrals,Partnership"
    private String valueTags;

    private String engagementType;

    private LocalDate nextFollowUp;

    private String notes;
}