package response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import model.UserModel;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AuthResponse {
    private UserModel user;
    
    @JsonProperty("access_token")
    private String accessToken;
    
    @JsonProperty("refresh_token")
    private String refreshToken;
    
    @JsonProperty("authentication_method")
    private String authenticationMethod;
}