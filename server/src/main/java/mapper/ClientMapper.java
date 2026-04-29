package mapper;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import entity.ClientEntity;
import entity.CustomerEntity;
import request.ClientRequest;
import response.ClientResponse;
import response.CustomerLogResponse;

public final class ClientMapper {

    private ClientMapper() {}

    // ── Entity ────────────────────────────────────────────────────────────────

    public static ClientEntity toEntity(ClientRequest req, String ownerId, UUID customerId) {
        return ClientEntity.builder()
                .customerId(customerId)
                .ownerId(ownerId)
                .clientType(nullIfEmpty(req.getClientType()))
                .clientSince(req.getClientSince() != null ? req.getClientSince() : LocalDate.now())
                .conversionReason(nullIfEmpty(req.getConversionReason()))
                .valueTags(nullIfEmpty(req.getValueTags()))
                .engagementType(nullIfEmpty(req.getEngagementType()))
                .nextFollowUp(req.getNextFollowUp())
                .notes(nullIfEmpty(req.getNotes()))
                .build();
    }

    // ── Response (list — no logs) ──────────────────────────────────────────────

    public static ClientResponse toResponse(ClientEntity cl, CustomerEntity cu) {
        return toResponse(cl, cu, Collections.emptyList());
    }

    // ── Response (detail — with logs) ─────────────────────────────────────────

    public static ClientResponse toResponse(ClientEntity cl, CustomerEntity cu,
            List<CustomerLogResponse> logs) {
        return ClientResponse.builder()
                // Client fields
                .id(cl.getId())
                .customerId(cl.getCustomerId())
                .clientType(cl.getClientType())
                .clientSince(cl.getClientSince())
                .conversionReason(cl.getConversionReason())
                .valueTags(splitTags(cl.getValueTags()))
                .engagementType(cl.getEngagementType())
                .nextFollowUp(cl.getNextFollowUp())
                .notes(cl.getNotes())
                // Full customer fields
                .firstName(cu.getFirstName())
                .lastName(cu.getLastName())
                .profilePicture(cu.getProfilePicture())
                .primaryEmail(cu.getPrimaryEmail())
                .secondaryEmail(cu.getSecondaryEmail())
                .primaryContactNo(cu.getPrimaryContactNo())
                .secondaryContactNo(cu.getSecondaryContactNo())
                .role(cu.getRole())
                .designation(cu.getDesignation())
                .company(cu.getCompany())
                .addressStreet(cu.getAddressStreet())
                .addressNumber(cu.getAddressNumber())
                .addressPostcode(cu.getAddressPostcode())
                .addressCity(cu.getAddressCity())
                .addressState(cu.getAddressState())
                .addressCountry(cu.getAddressCountry())
                .socialLinkedin(cu.getSocialLinkedin())
                .socialTwitter(cu.getSocialTwitter())
                .socialYoutube(cu.getSocialYoutube())
                .lastContactedDate(cu.getLastContactedDate())
                .referredBy(cu.getReferredBy())
                // Logs
                .logs(logs)
                // Timestamps
                .createdAt(cl.getCreatedAt())
                .updatedAt(cl.getUpdatedAt())
                .build();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private static List<String> splitTags(String valueTags) {
        if (valueTags == null || valueTags.isBlank()) return Collections.emptyList();
        return Arrays.stream(valueTags.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    private static String nullIfEmpty(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }
}