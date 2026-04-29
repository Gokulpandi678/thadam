package request;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CustomerLogRequest {
    private UUID id;

    @NotBlank(message = "Type is required")
    private String type;

    private String description;
    private String duration;
    private LocalDate date;
}