package filter;

import context.RequestContext;
import exception.AppException;
import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.Cookie;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import utility.TokenUtil;

@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthFilter implements ContainerRequestFilter {

    private static final String AUTH_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";
    private static final String ACCESS_TOKEN_COOKIE = "access_token";
    private static final String AUTH_PATH_PREFIX = "/api/v1/auth";
    private static final String X_FORWARDED_FOR = "X-Forwarded-For";
    private static final String X_DEVICE_ID = "X-Device-Id";

    @Inject
    RequestContext requestContext;

    @Override
    public void filter(ContainerRequestContext ctx) {

        requestContext.setRequestStartTime(System.currentTimeMillis());

        requestContext.setDeviceId(resolveDeviceId(ctx));

        if ("OPTIONS".equalsIgnoreCase(ctx.getMethod())) {
            return;
        }

        String path = ctx.getUriInfo().getPath();
        if (path.startsWith(AUTH_PATH_PREFIX)) {
            return;
        }

        String token = extractToken(ctx);
        if (token == null) {
            throw new AppException("Missing or invalid credentials", Response.Status.UNAUTHORIZED);
        }

        try {
            requestContext.setUserId(TokenUtil.getUserId(token));
        } catch (Exception e) {
            throw new AppException("Invalid or expired token", Response.Status.UNAUTHORIZED);
        }
    }
    
    private String extractToken(ContainerRequestContext ctx) {
        String authHeader = ctx.getHeaderString(AUTH_HEADER);
        if (authHeader != null && authHeader.startsWith(BEARER_PREFIX)) {
            return authHeader.substring(BEARER_PREFIX.length()).trim();
        }
        Cookie cookie = ctx.getCookies().get(ACCESS_TOKEN_COOKIE);
        return cookie != null ? cookie.getValue() : null;
    }
    
    private String resolveDeviceId(ContainerRequestContext ctx) {
        String deviceId = ctx.getHeaderString(X_DEVICE_ID);
        if (deviceId != null && !deviceId.isBlank()) {
            return deviceId.trim();
        }
        String xff = ctx.getHeaderString(X_FORWARDED_FOR);
        if (xff != null && !xff.isBlank()) {
            return xff.split(",")[0].trim();
        }
        return "unknown";
    }
}