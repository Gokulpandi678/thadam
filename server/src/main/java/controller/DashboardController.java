package controller;

import org.jboss.resteasy.reactive.RestResponse;

import context.RequestContext;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import lombok.RequiredArgsConstructor;
import response.GenericResponse;
import service.CustomerService;
import service.DashboardService;

@Path("/api/v1/dashboard")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RequiredArgsConstructor(onConstructor = @__(@Inject))
public class DashboardController {
    private final RequestContext requestContext;
    private final DashboardService dashboardService;
    
    @GET
    public RestResponse<GenericResponse> getDashboard() {
        return dashboardService.getDashboard(requestContext.getUserId());
    }
}
