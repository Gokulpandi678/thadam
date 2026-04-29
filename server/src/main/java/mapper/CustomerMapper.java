package mapper;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import entity.ClientEntity;
import entity.CustomerEntity;
import request.CustomerRequest;
import response.CustomerLogResponse;
import response.CustomerResponse;

public final class CustomerMapper {

	private CustomerMapper() {
		// utility class
	}

	public static CustomerEntity toEntity(CustomerRequest req, String ownerId) {
		return CustomerEntity.builder().ownerId(ownerId)

				// Personal Info
				.firstName(nullIfEmpty(req.getFirstName())).lastName(nullIfEmpty(req.getLastName()))
//				.profilePicture(nullIfEmpty(req.getProfilePicture()))

				// Contact Info
				.primaryEmail(nullIfEmptyLower(req.getPrimaryEmail()))
				.secondaryEmail(nullIfEmptyLower(req.getSecondaryEmail()))
				.primaryContactNo(nullIfEmpty(req.getPrimaryContactNo()))
				.secondaryContactNo(nullIfEmpty(req.getSecondaryContactNo()))

				// Professional Info
				.role(nullIfEmpty(req.getRole())).designation(nullIfEmpty(req.getDesignation()))
				.company(nullIfEmpty(req.getCompany()))

				// Address
				.addressStreet(nullIfEmpty(req.getAddressStreet())).addressNumber(nullIfEmpty(req.getAddressNumber()))
				.addressPostcode(nullIfEmpty(req.getAddressPostcode())).addressCity(nullIfEmpty(req.getAddressCity()))
				.addressState(nullIfEmpty(req.getAddressState())).addressCountry(nullIfEmpty(req.getAddressCountry()))

				// Social Media
				.socialLinkedin(nullIfEmpty(req.getSocialLinkedin())).socialTwitter(nullIfEmpty(req.getSocialTwitter()))
				.socialYoutube(nullIfEmpty(req.getSocialYoutube()))

				// Tracking
				.lastContactedDate(req.getLastContactedDate()).referredBy(nullIfEmpty(req.getReferredBy()))

				.build();
	}

	/**
	 * Used by getCustomers (list) — no logs loaded.
	 */
	public static CustomerResponse toResponse(CustomerEntity e) {
		return toResponse(e, Collections.emptyList(), null);
	}

	/**
	 * Used by getCustomer (single) — logs included.
	 */
	public static CustomerResponse toResponse(CustomerEntity e, List<CustomerLogResponse> logs, Optional<ClientEntity> cl) {
		return CustomerResponse.builder().id(e.getId())
				// Personal Info
				.firstName(e.getFirstName()).lastName(e.getLastName()).profilePicture(e.getProfilePicture())
				// Contact Info
				.primaryEmail(e.getPrimaryEmail()).secondaryEmail(e.getSecondaryEmail())
				.primaryContactNo(e.getPrimaryContactNo()).secondaryContactNo(e.getSecondaryContactNo())
				// Professional Info
				.role(e.getRole()).designation(e.getDesignation()).company(e.getCompany())
				// Address
				.addressStreet(e.getAddressStreet()).addressNumber(e.getAddressNumber())
				.addressPostcode(e.getAddressPostcode()).addressCity(e.getAddressCity())
				.addressState(e.getAddressState()).addressCountry(e.getAddressCountry())
				// Social Media
				.socialLinkedin(e.getSocialLinkedin()).socialTwitter(e.getSocialTwitter())
				.socialYoutube(e.getSocialYoutube())
				// Tracking
				.lastContactedDate(e.getLastContactedDate()).referredBy(e.getReferredBy())
				// Logs
				.logs(logs)
				.client(cl)
				// Timestamps
				.createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt()).build();
	}

	private static String nullIfEmpty(String value) {
		if (value == null || value.trim().isEmpty()) {
			return null;
		}
		return value.trim();
	}

	private static String nullIfEmptyLower(String value) {
		if (value == null || value.trim().isEmpty()) {
			return null;
		}
		return value.trim().toLowerCase();
	}
}