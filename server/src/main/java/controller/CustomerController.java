package controller;

import java.util.List;
import java.util.UUID;

import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import context.RequestContext;
import jakarta.inject.Inject;
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
import request.CustomerLogRequest;
import request.CustomerRequest;
import response.GenericResponse;
import service.CustomerService;

@Path("/api/v1/customers")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;
    private final RequestContext requestContext;

    @GET
    @Path("/getAllCustomers")
    public RestResponse<GenericResponse> getCustomers(
            @QueryParam("search") String search,
            @QueryParam("role") List<String> roles,
            @QueryParam("designation") List<String> designations,
            @QueryParam("city") List<String> cities,
            @DefaultValue("0") @QueryParam("page") int page) {

        return customerService.getCustomers(
                requestContext.getUserId(), search, roles, designations, cities, page);
    }

    @GET
    @Path("/filterOptions")
    public RestResponse<GenericResponse> getFilterOptions() {
        return customerService.getFilterOptions(requestContext.getUserId());
    }

    @GET
    @Path("/{id}")
    public RestResponse<GenericResponse> getCustomer(@PathParam("id") UUID id) {
        return customerService.getCustomer(id, requestContext.getUserId());
    }

    @POST
    @Path("/createCustomer")
    public RestResponse<GenericResponse> createCustomer(@Valid CustomerRequest request) {
        return customerService.createCustomer(request, requestContext.getUserId());
    }

    @PUT
    @Path("/updateCustomer/{id}")
    public RestResponse<GenericResponse> updateCustomer(
            @PathParam("id") UUID id, @Valid CustomerRequest request) {
        return customerService.updateCustomer(id, request, requestContext.getUserId());
    }

    @DELETE
    @Path("/deleteCustomer/{id}")
    public RestResponse<GenericResponse> deleteCustomer(@PathParam("id") UUID id) {
        return customerService.deleteCustomer(id, requestContext.getUserId());
    }

    @POST
    @Path("/{customerId}/addLogs")
    public RestResponse<GenericResponse> addLog(
            @PathParam("customerId") UUID customerId,
            @Valid CustomerLogRequest request) {
        return customerService.addLog(customerId, request, requestContext.getUserId());
    }

    @PUT
    @Path("/{customerId}/editLog/{logId}")
    public RestResponse<GenericResponse> editLog(
    		@PathParam("customerId") UUID customerId,
    		@PathParam("logId") UUID logId,
    		@Valid CustomerLogRequest request) {
    	return customerService.editLog(customerId, logId, request, requestContext.getUserId());
    }
    
    @DELETE
    @Path("/{customerId}/deleteLog/{logId}")
    public RestResponse<GenericResponse> deleteLog(
    		@PathParam("customerId") UUID customerId,
    		@PathParam("logId") UUID logId) {
    	return customerService.deleteLog(customerId, logId, requestContext.getUserId());
    }
    
    @POST
    @Path("/{id}/addProfilePic")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public RestResponse<GenericResponse> addProfilePic(
    		@PathParam("id") UUID id,
    		@RestForm("file") FileUpload file) {
    	return customerService.addProfilePic(id, file, requestContext.getUserId());
    }
    
    @PUT
    @Path("/{id}/editProfilePic")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public RestResponse<GenericResponse> editProfilePic(
            @PathParam("id") UUID id,
            @RestForm("file") FileUpload file) {
        return customerService.editProfilePic(id, file, requestContext.getUserId());
    }
    

    @DELETE
    @Path("/{id}/deleteProfilePic")
    public RestResponse<GenericResponse> deleteProfilePic(@PathParam("id") UUID id) {
        return customerService.deleteProfilePic(id, requestContext.getUserId());
    }
    
    @GET
    @Path("/recycle-bin")
    public RestResponse<GenericResponse> getDeletedCustomers() {
        return customerService.getDeletedCustomers(requestContext.getUserId());
    }

    @PUT
    @Path("/recycle-bin/{id}/restore")
    public RestResponse<GenericResponse> restoreCustomer(@PathParam("id") UUID id) {
        return customerService.restoreCustomer(id, requestContext.getUserId());
    }

    @DELETE
    @Path("/recycle-bin/{id}/permanent")
    public RestResponse<GenericResponse> permanentlyDeleteCustomer(@PathParam("id") UUID id) {
        return customerService.permanentlyDeleteCustomer(id, requestContext.getUserId());
    }
}