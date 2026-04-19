package controller;

import context.RequestContext;
import org.jboss.resteasy.reactive.RestResponse;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
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