package response;

import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.RestResponse.Status;

import jakarta.enterprise.context.ApplicationScoped;
import utility.AuthConstants;

@ApplicationScoped
public class PrepareResponse {

  public RestResponse<GenericResponse> successMessage(String message) {
    GenericResponse response = new GenericResponse();
    response.setStatus(AuthConstants.OK);
    response.setMessage(message);
    return RestResponse.ResponseBuilder.create(Status.CREATED, response).build();
  }

  public RestResponse<GenericResponse> successObject(Object result) {
    GenericResponse response = new GenericResponse();
    response.setStatus(AuthConstants.OK);
    response.setMessage(AuthConstants.SUCCESS);
    response.setResult(result);
    return RestResponse.ResponseBuilder.create(Status.OK, response).build();
  }

  public RestResponse<GenericResponse> successMessageWithObject(String message, Object result) {
    GenericResponse response = new GenericResponse();
    response.setStatus(AuthConstants.OK);
    response.setMessage(message);
    response.setResult(result);
    return RestResponse.ResponseBuilder.create(Status.OK, response).build();
  }

  public RestResponse<GenericResponse> failureMessage(String message) {
    GenericResponse response = new GenericResponse();
    response.setStatus(AuthConstants.NOT_OK);
    response.setMessage(message);
    return RestResponse.ResponseBuilder.create(Status.INTERNAL_SERVER_ERROR, response).build();
  }

  public RestResponse<GenericResponse> failedObject(Object result) {
    GenericResponse response = new GenericResponse();
    response.setStatus(AuthConstants.OK);
    response.setMessage(AuthConstants.FAILED);
    response.setResult(result);
    return RestResponse.ResponseBuilder.create(Status.OK, response).build();
  }

  public RestResponse<GenericResponse> failedMessageWithObject(String message, Object result) {
    GenericResponse response = new GenericResponse();
    response.setStatus(AuthConstants.OK);
    response.setMessage(message);
    response.setResult(result);
    return RestResponse.ResponseBuilder.create(Status.OK, response).build();
  }

  public RestResponse<GenericResponse> unAuthorized() {
    GenericResponse response = new GenericResponse();
    response.setStatus(AuthConstants.NOT_OK);
    response.setMessage("Unauthorized");
    return RestResponse.ResponseBuilder.create(Status.UNAUTHORIZED, response).build();
  }

  public RestResponse<GenericResponse> unAuthorizedMessage(String message) {
    GenericResponse response = new GenericResponse();
    response.setStatus(AuthConstants.NOT_OK);
    response.setMessage(message);
    return RestResponse.ResponseBuilder.create(Status.UNAUTHORIZED, response).build();
  }

  public RestResponse<GenericResponse> badRequest(String message){
    GenericResponse response = new GenericResponse();
    response.setStatus(AuthConstants.NOT_OK);
    response.setMessage(message);
    return RestResponse.ResponseBuilder.create(Status.BAD_REQUEST, response).build();
  }

  public RestResponse<GenericResponse> conflict(String message){
    GenericResponse response = new GenericResponse();
    response.setStatus(AuthConstants.NOT_OK);
    response.setMessage(message);
    return RestResponse.ResponseBuilder.create(Status.CONFLICT, response).build();
  }
}
