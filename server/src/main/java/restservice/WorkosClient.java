package restservice;

import java.util.Map;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import response.AuthResponse;

@RegisterRestClient(configKey = "workos-api")
@Path("/user_management")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface WorkosClient {

    @POST
    @Path("/authenticate")
    AuthResponse authenticateWithCode(Map<String, String> body);
    
    @POST
    @Path("/authorize")
    AuthResponse authorizeWithCode(Map<String, String> body);
}