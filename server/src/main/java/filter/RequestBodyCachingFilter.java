package filter;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.ext.Provider;
import jakarta.annotation.Priority;
import jakarta.ws.rs.Priorities;
import io.quarkus.logging.Log;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;


@Provider
@Priority(Priorities.AUTHENTICATION - 1)
public class RequestBodyCachingFilter implements ContainerRequestFilter {

    static final String CACHED_REQUEST_BODY = "cachedRequestBody";

    @Override
    public void filter(ContainerRequestContext ctx) {
        try {
            InputStream original = ctx.getEntityStream();
            byte[] bytes = original.readAllBytes();

            ctx.setProperty(CACHED_REQUEST_BODY, bytes);

            ctx.setEntityStream(new ByteArrayInputStream(bytes));

        } catch (IOException e) {
            Log.warnf("RequestBodyCachingFilter: failed to cache request body: %s", e.getMessage());
            ctx.setProperty(CACHED_REQUEST_BODY, new byte[0]);
        }
    }
}