package exception;

import java.util.Map;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class GlobalExceptionMapper implements ExceptionMapper<AppException> {

    @Override
    public Response toResponse(AppException ex) {
        return Response.status(ex.getStatus())
                .entity(Map.of("error", ex.getMessage()))
                .build();
    }
}