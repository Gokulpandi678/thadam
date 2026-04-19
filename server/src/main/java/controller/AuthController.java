package controller;

import java.net.URI;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;

import io.quarkus.logging.Log;
import jakarta.inject.Inject;
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
import response.GenericResponse;
import service.AuthService;

@Path("/api/v1/auth")
@Produces(MediaType.APPLICATION_JSON)
@RequiredArgsConstructor(onConstructor = @__(@Inject))
public class AuthController {

    private static final String ACCESS_TOKEN_COOKIE = "access_token";
    private static final String WEB_SUCCESS_REDIRECT = "http://localhost:5173/";

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

        String accessToken = authService.authenticateWithCode(code);
        if (accessToken == null) {
            GenericResponse errorBody = authService.buildErrorResponse("Authentication failed");
            return Response.status(Response.Status.UNAUTHORIZED).entity(errorBody).build();
        }

        NewCookie accessTokenCookie = new NewCookie.Builder(ACCESS_TOKEN_COOKIE)
                .value(accessToken)
                .path("/")
                .httpOnly(true)
                .secure(false)
                .sameSite(NewCookie.SameSite.STRICT)
                .build();

        return Response.seeOther(URI.create(WEB_SUCCESS_REDIRECT))
                .cookie(accessTokenCookie)
                .build();
    }
    
    @POST
    @Path("/logout")
    public Response logout(@CookieParam(ACCESS_TOKEN_COOKIE) String accessToken) {
        if (accessToken == null) {
            return Response.seeOther(URI.create(WEB_SUCCESS_REDIRECT)).build();
        }

        try {
            // 1. Extract session ID from access token
            DecodedJWT jwt = JWT.decode(accessToken);
            String sessionId = jwt.getClaim("sid").asString();
            
            // 2. Generate WorkOS logout URL
            String workOSLogoutUrl = authService.buildLogoutUrl(sessionId);
            
            // 3. Clear the application cookie
            NewCookie deleteCookie = new NewCookie.Builder(ACCESS_TOKEN_COOKIE)
                    .value("")
                    .path("/")
                    .maxAge(0)
                    .httpOnly(true)
                    .secure(false)
                    .sameSite(NewCookie.SameSite.STRICT)
                    .build();
            
            // 4. Redirect to WorkOS logout endpoint
            return Response.seeOther(URI.create(workOSLogoutUrl))
                    .cookie(deleteCookie)
                    .build();
                    
        } catch (Exception e) {
            Log.errorf("Logout error: %s", e.getMessage());
            // Still clear local cookie even if WorkOS logout fails
            NewCookie deleteCookie = new NewCookie.Builder(ACCESS_TOKEN_COOKIE)
                    .value("")
                    .path("/")
                    .maxAge(0)
                    .build();
            return Response.seeOther(URI.create(WEB_SUCCESS_REDIRECT))
                    .cookie(deleteCookie)
                    .build();
        }
    }
}