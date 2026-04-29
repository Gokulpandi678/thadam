package service;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

import org.eclipse.microprofile.rest.client.inject.RestClient;

import com.workos.WorkOS;
import com.workos.usermanagement.types.UserManagementProviderEnumType;

import config.SystemProperties;
import config.WorkosProperties;
import entity.UserEntity;
import io.quarkus.logging.Log;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import repositories.UserRepository;
import response.AuthResponse;
import response.GenericResponse;
import restservice.WorkosClient;
import utility.AuthConstants;

@ApplicationScoped
@RequiredArgsConstructor
public class AuthService {

	private final WorkosProperties props;

	@RestClient
	WorkosClient workosClient;

	private final UserRepository userRepository;

	private WorkOS workos;

	private final SystemProperties sysProps;

	@PostConstruct
	void init() {
		this.workos = new WorkOS(props.getWorkosApiKey());
	}

	public Response buildAuthorizationRedirect(String clientType) {

		try {

			String url = workos.userManagement.getAuthorizationUrl(props.getWorkosClientId(), sysProps.getLoginRedirectUrl())
					.provider(UserManagementProviderEnumType.AuthKit).state(clientType).build();

			return Response.seeOther(URI.create(url)).build();

		} catch (Exception e) {
			Log.error("Failed to build authorization URL", e);

			return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity(buildErrorResponse("Failed to build authorization URL")).build();
		}
	}

	public AuthResponse authenticateWithCode(String code) {

		try {

			Map<String, String> authRequest = new HashMap<>();
			authRequest.put("client_id", props.getWorkosClientId());
			authRequest.put("client_secret", props.getWorkosApiKey());
			authRequest.put("code", code);
			authRequest.put("grant_type", "authorization_code");
			authRequest.put("redirect_uri", sysProps.getLoginRedirectUrl());

			AuthResponse oauthUser = workosClient.authenticateWithCode(authRequest);

			UserEntity user = UserEntity.builder().userId(oauthUser.getUser().getId())
					.email(oauthUser.getUser().getEmail()).firstName(oauthUser.getUser().getFirstName())
					.lastName(oauthUser.getUser().getLastName()).emailVerified(oauthUser.getUser().isEmailVerified())
					.profilePicture(oauthUser.getUser().getProfilePicture()).build();

			userRepository.upsertUser(user);

			return oauthUser;

		} catch (Exception e) {
			Log.errorf("Authentication failed: %s", e.getMessage());
			return null;
		}
	}

	public AuthResponse refreshAccessToken(String refreshToken) {

		try {

			Map<String, String> refreshRequest = new HashMap<>();
			refreshRequest.put("client_id", props.getWorkosClientId());
			refreshRequest.put("client_secret", props.getWorkosApiKey());
			refreshRequest.put("grant_type", "refresh_token");
			refreshRequest.put("refresh_token", refreshToken);

			return workosClient.refreshToken(refreshRequest);

		} catch (Exception e) {
			Log.errorf("Refresh token failed: %s", e.getMessage());
			return null;
		}
	}

	public String buildLogoutUrl(String sessionId) {

		try {

			return workos.userManagement.getLogoutUrl(sessionId);

		} catch (Exception e) {

			Log.errorf("Failed to build logout URL: %s", e.getMessage());

			String returnToUrl = sysProps.getWebSuccessRedirect();

			return String.format("https://api.workos.com/user_management/sessions/%s/logout?client_id=%s&return_to=%s",
					sessionId, props.getWorkosClientId(), returnToUrl);
		}
	}

	public GenericResponse buildErrorResponse(String message) {

		GenericResponse response = new GenericResponse();
		response.setStatus(AuthConstants.NOT_OK);
		response.setMessage(message);

		return response;
	}

	public GenericResponse buildSuccessResponse(String message) {

		GenericResponse response = new GenericResponse();
		response.setStatus(AuthConstants.OK);
		response.setMessage(message);

		return response;
	}
}