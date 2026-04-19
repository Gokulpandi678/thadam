package request;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CustomerRequest {

    @NotBlank(message = "First name is required")
    private String firstName;
    @NotBlank(message = "Last name is required")
    private String lastName;
//    private String profilePicture;
    
    @NotBlank(message = "Primary email is required")
    @Email(message = "Invalid primary email format")
    private String primaryEmail;
    @Email(message = "Invalid secondary email format")
    private String secondaryEmail;
    private String primaryContactNo;
    private String secondaryContactNo;
    
    private String role;
    private String designation;
    private String company;

    private String addressStreet;
    private String addressNumber;
    private String addressPostcode;
    private String addressCity;
    private String addressState;
    private String addressCountry;

    private String socialLinkedin;
    private String socialTwitter;
    private String socialYoutube;

    private LocalDate lastContactedDate;
    private String referredBy;

    @Valid
    private List<CustomerLogRequest> logs;
}