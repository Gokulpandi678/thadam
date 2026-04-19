package service;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

import org.eclipse.microprofile.rest.client.inject.RestClient;

import com.workos.WorkOS;
import com.workos.usermanagement.types.UserManagementProviderEnumType;

import config.WorkosProperties;
import entity.UserEntity;
import io.quarkus.logging.Log;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import repositories.UserRepository;
import response.AuthResponse;
import response.GenericResponse;
import restservice.WorkosClient;
import utility.AuthConstants;

@ApplicationScoped
public class AuthService {

    @Inject
    WorkosProperties props;

    @Inject
    @RestClient
    WorkosClient workosClient;

    @Inject
    UserRepository userRepository;

    private WorkOS workos;

    @PostConstruct
    void init() {
        this.workos = new WorkOS(props.getWorkosApiKey());
    }

    /**
     * Builds a JAX-RS redirect Response pointing to the WorkOS authorization URL.
     * Returns an error redirect if URL generation fails.
     */
    public Response buildAuthorizationRedirect(String clientType) {
        try {
            String url = workos.userManagement
                    .getAuthorizationUrl(
                            props.getWorkosClientId(),
                            "http://localhost:5000/api/v1/auth/callback")
                    .provider(UserManagementProviderEnumType.AuthKit)
                    .state(clientType)
                    .build();
            return Response.seeOther(URI.create(url)).build();
        } catch (Exception e) {
            Log.error("Failed to build authorization URL", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(buildErrorResponse("Failed to build authorization URL"))
                    .build();
        }
    }

    /**
     * Exchanges the OAuth authorization code for an access token,
     * upserts the user in the database, and returns the raw access token string.
     * Returns null if authentication fails (caller handles error response).
     */
    public String authenticateWithCode(String code) {
        try {
            Map<String, String> authRequest = new HashMap<>();
            authRequest.put("client_id", props.getWorkosClientId());
            authRequest.put("client_secret", props.getWorkosApiKey());
            authRequest.put("code", code);
            authRequest.put("grant_type", "authorization_code");
            authRequest.put("redirect_uri", "http://localhost:5000/api/v1/auth/callback");

            AuthResponse oauthUser = workosClient.authenticateWithCode(authRequest);

            UserEntity user = UserEntity.builder()
                    .userId(oauthUser.getUser().getId())
                    .email(oauthUser.getUser().getEmail())
                    .firstName(oauthUser.getUser().getFirstName())
                    .lastName(oauthUser.getUser().getLastName())
                    .emailVerified(oauthUser.getUser().isEmailVerified())
                    .profilePicture(oauthUser.getUser().getProfilePicture())
                    .build();

            userRepository.upsertUser(user);

            return oauthUser.getAccessToken();

        } catch (Exception e) {
            Log.errorf("Authentication failed: %s", e.getMessage());
            return null;
        }
    }

    /**
     * Builds the WorkOS logout URL to terminate the session on the identity provider side
     * @param sessionId The session ID extracted from the access token
     * @return The complete WorkOS logout URL
     */
    public String buildLogoutUrl(String sessionId) {
        try {
            // Using WorkOS Java SDK to build logout URL
            String logoutUrl = workos.userManagement.getLogoutUrl(sessionId);
            return logoutUrl;
        } catch (Exception e) {
            Log.errorf("Failed to build logout URL: %s", e.getMessage());
            // Fallback: manual URL construction
            String returnToUrl = "http://localhost:5173/"; // Your frontend URL after logout
            return String.format(
                "https://api.workos.com/user_management/sessions/%s/logout?client_id=%s&return_to=%s",
                sessionId, 
                props.getWorkosClientId(), 
                returnToUrl
            );
        }
    }
    
    /**
     * Builds a structured GenericResponse for error cases in the callback flow.
     */
    public GenericResponse buildErrorResponse(String message) {
        GenericResponse response = new GenericResponse();
        response.setStatus(AuthConstants.NOT_OK);
        response.setMessage(message);
        return response;
    }
}