package controller;

import org.jboss.resteasy.reactive.RestResponse;

import context.RequestContext;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import lombok.RequiredArgsConstructor;
import request.UpdateProfileRequest;
import response.GenericResponse;
import service.ProfileService;

@Path("/api/v1/profile")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final RequestContext requestContext;

    @GET
    public RestResponse<GenericResponse> getProfile() {
        return profileService.getProfile(requestContext.getUserId());
    }

    @PUT
    public RestResponse<GenericResponse> updateProfile(UpdateProfileRequest request) {
        return profileService.updateProfile(requestContext.getUserId(), request);
    }
}