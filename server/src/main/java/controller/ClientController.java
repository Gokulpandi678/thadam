package controller;

import java.util.List;
import java.util.UUID;

import org.jboss.resteasy.reactive.RestResponse;

import context.RequestContext;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import lombok.RequiredArgsConstructor;
import request.ClientRequest;
import response.GenericResponse;
import service.ClientService;

@Path("/api/v1/clients")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;
    private final RequestContext requestContext;

    @GET
    @Path("/getAllClients")
    public RestResponse<GenericResponse> getClients(
            @QueryParam("search") String search,
            @QueryParam("clientType") List<String> clientTypes,
            @QueryParam("engagementType") List<String> engagementTypes,
            @DefaultValue("0") @QueryParam("page") int page) {

        return clientService.getClients(
                requestContext.getUserId(), search, clientTypes, engagementTypes, page);
    }

    @GET
    @Path("/filterOptions")
    public RestResponse<GenericResponse> getClientFilterOptions() {
        return clientService.getClientFilterOptions(requestContext.getUserId());
    }

    @GET
    @Path("/{customerId}")
    public RestResponse<GenericResponse> getClient(@PathParam("customerId") UUID customerId) {
        return clientService.getClient(customerId, requestContext.getUserId());
    }

    @POST
    @Path("/{customerId}/convert")
    public RestResponse<GenericResponse> convertAsClient(
            @PathParam("customerId") UUID customerId,
            @Valid ClientRequest request) {
        return clientService.convertAsClient(customerId, request, requestContext.getUserId());
    }

    @PUT
    @Path("/{customerId}")
    public RestResponse<GenericResponse> updateClient(
            @PathParam("customerId") UUID customerId,
            @Valid ClientRequest request) {
        return clientService.updateClient(customerId, request, requestContext.getUserId());
    }

    @DELETE
    @Path("/{customerId}/revert")
    public RestResponse<GenericResponse> revertClient(@PathParam("customerId") UUID customerId) {
        return clientService.revertClient(customerId, requestContext.getUserId());
    }
}