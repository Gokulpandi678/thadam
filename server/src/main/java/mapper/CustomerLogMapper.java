package mapper;

import java.util.UUID;

import entity.CustomerLogEntity;
import request.CustomerLogRequest;
import response.CustomerLogResponse;

public final class CustomerLogMapper {

    private CustomerLogMapper() {
        // utility class
    }

    public static CustomerLogEntity toEntity(CustomerLogRequest req, String userId, UUID customerId) {
        return CustomerLogEntity.builder()
                .userId(userId)
                .customerId(customerId)
//                .title(req.getTitle().trim())
                .type(req.getType().trim())
                .description(req.getDescription())
                .build();
    }

    public static CustomerLogResponse toResponse(CustomerLogEntity e) {
        return CustomerLogResponse.builder()
                .id(e.getId())
                .userId(e.getUserId())
                .customerId(e.getCustomerId())
//                .title(e.getTitle())
                .type(e.getType())
                .description(e.getDescription())
                .createdAt(e.getCreatedAt())
                .build();
    }
}