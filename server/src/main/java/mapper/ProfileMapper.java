package mapper;

import response.ProfileResponse;
import entity.UserEntity;

public final class ProfileMapper {

    private ProfileMapper() {
        // utility class
    }

    public static ProfileResponse toResponse(UserEntity entity) {
        return ProfileResponse.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .email(entity.getEmail())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .profilePicture(entity.getProfilePicture())
                .emailVerified(entity.getEmailVerified())
                .lastLoggedIn(entity.getLastLoggedIn())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}