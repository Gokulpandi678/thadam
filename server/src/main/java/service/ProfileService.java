package service;

import entity.UserEntity;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import mapper.ProfileMapper;
import repositories.UserRepository;
import request.UpdateProfileRequest;
import response.GenericResponse;
import response.PrepareResponse;
import org.jboss.resteasy.reactive.RestResponse;

@ApplicationScoped
public class ProfileService {

    @Inject
    UserRepository userRepository;

    @Inject
    PrepareResponse prepareResponse;

    /**
     * Retrieves the profile of the authenticated user by their userId.
     */
    public RestResponse<GenericResponse> getProfile(String userId) {
        try {
            UserEntity user = userRepository.findByUserId(userId).orElse(null);
            if (user == null) {
                return prepareResponse.unAuthorizedMessage("User not found");
            }
            return prepareResponse.successMessageWithObject("Profile fetched successfully", ProfileMapper.toResponse(user));
        } catch (Exception e) {
            Log.errorf("Failed to get profile for userId %s: %s", userId, e.getMessage());
            return prepareResponse.failureMessage("Failed to get profile");
        }
    }

    /**
     * Updates the profile of the authenticated user.
     * Only non-null fields in the request are applied.
     */
    @Transactional
    public RestResponse<GenericResponse> updateProfile(String userId, UpdateProfileRequest request) {
        try {
            UserEntity user = userRepository.findByUserId(userId).orElse(null);
            if (user == null) {
                return prepareResponse.unAuthorizedMessage("User not found");
            }

            if (request.getFirstName() != null) {
                user.setFirstName(request.getFirstName().trim());
            }
            if (request.getLastName() != null) {
                user.setLastName(request.getLastName().trim());
            }
            if (request.getProfilePicture() != null) {
                user.setProfilePicture(request.getProfilePicture());
            }

            userRepository.persist(user);
            return prepareResponse.successMessageWithObject("Profile updated successfully", ProfileMapper.toResponse(user));
        } catch (Exception e) {
            Log.errorf("Failed to update profile for userId %s: %s", userId, e.getMessage());
            return prepareResponse.failureMessage("Failed to update profile");
        }
    }
}