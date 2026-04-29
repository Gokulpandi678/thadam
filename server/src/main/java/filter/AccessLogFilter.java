package filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import context.RequestContext;
import entity.AccessLogEntity;
import io.quarkus.logging.Log;
import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;
import repositories.AccessLogRepository;

import java.nio.charset.StandardCharsets;

@Provider
@Priority(Priorities.USER + 1)
public class AccessLogFilter implements ContainerResponseFilter {

    @Inject
    RequestContext requestContext;

    @Inject
    AccessLogRepository accessLogRepository;

    @Inject
    ObjectMapper objectMapper;

    @Override
    @Transactional
    public void filter(ContainerRequestContext requestCtx,
                       ContainerResponseContext responseCtx) {
        try {
            long latencyMs = System.currentTimeMillis() - requestContext.getRequestStartTime();

            String requestUrl = buildRequestUrl(requestCtx);

            String requestBody = extractRequestBody(requestCtx);

            String responseBody = extractResponseBody(responseCtx);

            AccessLogEntity log = AccessLogEntity.builder()
                    .userId(requestContext.getUserId())
                    .deviceId(requestContext.getDeviceId())
                    .httpMethod(requestCtx.getMethod())
                    .requestUrl(requestUrl)
                    .requestBody(requestBody)
                    .responseBody(responseBody)
                    .responseStatus(responseCtx.getStatus())
                    .latencyMs(latencyMs)
                    .build();

            accessLogRepository.persist(log);

        } catch (Exception e) {
            Log.warnf("AccessLogFilter: failed to persist access log: %s", e.getMessage());
        }
    }


    private String buildRequestUrl(ContainerRequestContext ctx) {
        StringBuilder url = new StringBuilder(ctx.getUriInfo().getPath());
        String query = ctx.getUriInfo().getRequestUri().getQuery();
        if (query != null && !query.isBlank()) {
            url.append("?").append(query);
        }
        return url.toString();
    }

    private String extractRequestBody(ContainerRequestContext ctx) {
        try {

            String contentType = ctx.getHeaderString("Content-Type");

            if (contentType != null && contentType.contains("multipart")) {
                return "[multipart request]";
            }

            byte[] cached = (byte[]) ctx.getProperty(RequestBodyCachingFilter.CACHED_REQUEST_BODY);

            if (cached == null || cached.length == 0) return null;

            String body = new String(cached, StandardCharsets.UTF_8);

            return body.replace("\0", "");

        } catch (Exception e) {
            Log.warnf("AccessLogFilter: could not read cached request body: %s", e.getMessage());
            return null;
        }
    }

    private String extractResponseBody(ContainerResponseContext ctx) {
        try {
            Object entity = ctx.getEntity();
            if (entity == null) return null;
            return objectMapper.writeValueAsString(entity);
        } catch (Exception e) {
            Log.warnf("AccessLogFilter: could not serialize response body: %s", e.getMessage());
            return null;
        }
    }
}