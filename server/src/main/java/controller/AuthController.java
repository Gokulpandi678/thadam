package controller;

import java.net.URI;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;

import config.SystemProperties;
import io.quarkus.logging.Log;
import jakarta.ws.rs.CookieParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import response.AuthResponse;
import response.GenericResponse;
import service.AuthService;

@Path("/api/v1/auth")
@Produces(MediaType.APPLICATION_JSON)
@RequiredArgsConstructor
public class AuthController {

    private static final String ACCESS_TOKEN_COOKIE = "access_token";
    private static final String REFRESH_TOKEN_COOKIE = "refresh_token";

    private static final int ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;
    private static final int REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30;

    private final SystemProperties sysProps;

    private final AuthService authService;
    
    @GET
    @Path("/login")
    public Response login() {
        return authService.buildAuthorizationRedirect("web");
    }

    @GET
    @Path("/callback")
    public Response callback(@QueryParam("code") String code,
                             @QueryParam("state") String state,
                             @QueryParam("error") String error) {

        if (error != null) {
            Log.errorf("WorkOS callback error: %s", error);
            GenericResponse errorBody = authService.buildErrorResponse("Authentication failed: " + error);
            return Response.status(Response.Status.UNAUTHORIZED).entity(errorBody).build();
        }

        AuthResponse authResponse = authService.authenticateWithCode(code);

        if (authResponse == null) {
            GenericResponse errorBody = authService.buildErrorResponse("Authentication failed");
            return Response.status(Response.Status.UNAUTHORIZED).entity(errorBody).build();
        }

        String accessToken = authResponse.getAccessToken();
        String refreshToken = authResponse.getRefreshToken();

        NewCookie accessCookie = new NewCookie.Builder(ACCESS_TOKEN_COOKIE)
                .value(accessToken)
                .path("/")
                .httpOnly(true)
                .secure(true)
                .sameSite(NewCookie.SameSite.NONE)
                .maxAge(ACCESS_TOKEN_MAX_AGE)
                .build();

        NewCookie refreshCookie = new NewCookie.Builder(REFRESH_TOKEN_COOKIE)
                .value(refreshToken)
                .path("/")
                .httpOnly(true)
                .secure(true)
                .sameSite(NewCookie.SameSite.NONE)
                .maxAge(REFRESH_TOKEN_MAX_AGE)
                .build();

        return Response.seeOther(URI.create(sysProps.getWebSuccessRedirect()))
                .cookie(accessCookie)
                .cookie(refreshCookie)
                .build();
    }

    @POST
    @Path("/refresh")
    public Response refresh(@CookieParam(REFRESH_TOKEN_COOKIE) String refreshToken) {

        if (refreshToken == null) {
            GenericResponse error = authService.buildErrorResponse("Missing refresh token");
            return Response.status(Response.Status.UNAUTHORIZED).entity(error).build();
        }

        AuthResponse refreshed = authService.refreshAccessToken(refreshToken);

        if (refreshed == null) {
            GenericResponse error = authService.buildErrorResponse("Refresh failed");
            return Response.status(Response.Status.UNAUTHORIZED).entity(error).build();
        }

        NewCookie accessCookie = new NewCookie.Builder(ACCESS_TOKEN_COOKIE)
                .value(refreshed.getAccessToken())
                .path("/")
                .httpOnly(true)
                .secure(true)
                .sameSite(NewCookie.SameSite.NONE)
                .maxAge(ACCESS_TOKEN_MAX_AGE)
                .build();

        GenericResponse successMessage = authService.buildSuccessResponse("Token refreshed");
        return Response.ok()
                .cookie(accessCookie)
                .entity(successMessage)
                .build();
    }

    @POST
    @Path("/logout")
    public Response logout(@CookieParam(ACCESS_TOKEN_COOKIE) String accessToken) {

        try {

            String workOSLogoutUrl = sysProps.getWebSuccessRedirect();

            if (accessToken != null) {
                DecodedJWT jwt = JWT.decode(accessToken);
                String sessionId = jwt.getClaim("sid").asString();
                workOSLogoutUrl = authService.buildLogoutUrl(sessionId);
            }

            NewCookie deleteAccess = new NewCookie.Builder(ACCESS_TOKEN_COOKIE)
                    .value("")
                    .path("/")
                    .maxAge(0)
                    .httpOnly(true)
                    .secure(true)
                    .build();

            NewCookie deleteRefresh = new NewCookie.Builder(REFRESH_TOKEN_COOKIE)
                    .value("")
                    .path("/")
                    .maxAge(0)
                    .httpOnly(true)
                    .secure(true)
                    .build();

            return Response.seeOther(URI.create(workOSLogoutUrl))
                    .cookie(deleteAccess)
                    .cookie(deleteRefresh)
                    .build();

        } catch (Exception e) {
            Log.errorf("Logout error: %s", e.getMessage());
            return Response.seeOther(URI.create(sysProps.getWebSuccessRedirect())).build();
        }
    }
}