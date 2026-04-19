package response;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileResponse {
    private UUID id;
    private String userId;
    private String email;
    private String firstName;
    private String lastName;
    private String profilePicture;
    private Boolean emailVerified;
    private LocalDateTime lastLoggedIn;
    private LocalDateTime createdAt;
}