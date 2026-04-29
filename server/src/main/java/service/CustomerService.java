package service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import entity.ClientEntity;
import entity.CustomerEntity;
import entity.CustomerLogEntity;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import mapper.CustomerLogMapper;
import mapper.CustomerMapper;
import repositories.ClientRepository;
import repositories.CustomerLogRepository;
import repositories.CustomerRepository;
import request.CustomerLogRequest;
import request.CustomerRequest;
import response.CustomerLogResponse;
import response.FilterOptionsResponse;
import response.GenericResponse;
import response.PageResponse;
import response.PrepareResponse;

@ApplicationScoped
@RequiredArgsConstructor
public class CustomerService {

	private static final int DEFAULT_PAGE_SIZE = 20;

	private final CustomerRepository customerRepository;
	private final CustomerLogRepository customerLogRepository;
	private final PrepareResponse prepareResponse;
	private final CloudinaryService cloudinaryService;
	private final ClientRepository clientRepository;
	
	/**
	 * Paginated customer list with optional search and multi-value filters.
	 */
	public RestResponse<GenericResponse> getCustomers(String ownerId, String search, List<String> roles,
			List<String> designations, List<String> cities, int page) {
		Log.debugf("Fetching customers for ownerId=%s, page=%d, search='%s', roles=%s, designations=%s, cities=%s",
				ownerId, page, search, roles, designations, cities);
		try {
			long totalElements = customerRepository.countSearchAndFilter(ownerId, search, roles, designations, cities);
			int totalPages = (int) Math.ceil((double) totalElements / DEFAULT_PAGE_SIZE);

			List<Object> data = customerRepository
					.searchAndFilter(ownerId, search, roles, designations, cities, page, DEFAULT_PAGE_SIZE).stream()
					.map(CustomerMapper::toResponse).collect(Collectors.toList());

			Log.infof("Fetched %d customers (page %d/%d) for ownerId=%s", data.size(), page + 1, totalPages, ownerId);

			PageResponse pageResponse = PageResponse.builder().data(data).totalElements(totalElements)
					.totalPages(totalPages).currentPage(page).pageSize(DEFAULT_PAGE_SIZE).hasNext(page < totalPages - 1)
					.hasPrevious(page > 0).build();

			return prepareResponse.successMessageWithObject("Customers fetched successfully", pageResponse);
		} catch (Exception e) {
			Log.errorf("Failed to fetch customers for ownerId %s: %s", ownerId, e.getMessage());
			return prepareResponse.failureMessage("Failed to fetch customers");
		}
	}

	/**
	 * Returns distinct filter option values for the authenticated user.
	 */
	public RestResponse<GenericResponse> getFilterOptions(String ownerId) {
		Log.debugf("Fetching filter options for ownerId=%s", ownerId);
		try {
			FilterOptionsResponse options = FilterOptionsResponse.builder()
					.roles(customerRepository.findDistinctRoles(ownerId))
					.designations(customerRepository.findDistinctDesignations(ownerId))
					.cities(customerRepository.findDistinctCities(ownerId)).build();

			Log.infof("Filter options fetched for ownerId=%s, roles=%d, designations=%d, cities=%d", ownerId,
					options.getRoles().size(), options.getDesignations().size(), options.getCities().size());

			return prepareResponse.successMessageWithObject("Filter options fetched successfully", options);
		} catch (Exception e) {
			Log.errorf("Failed to fetch filter options for ownerId %s: %s", ownerId, e.getMessage());
			return prepareResponse.failureMessage("Failed to fetch filter options");
		}
	}

	/**
	 * Retrieves a single customer by ID with logs, verifying ownership.
	 */
	public RestResponse<GenericResponse> getCustomer(UUID id, String ownerId) {
		Log.debugf("Fetching customer id=%s for ownerId=%s", id, ownerId);
		try {
			CustomerEntity customer = customerRepository.findByIdAndOwner(id, ownerId).orElse(null);
			if (customer == null) {
				Log.warnf("Customer id=%s not found or does not belong to ownerId=%s", id, ownerId);
				return prepareResponse.badRequest("Customer not found");
			}
			
			Optional<ClientEntity> client = null;
			if(customer.getRole().equalsIgnoreCase("client")) {
				client = clientRepository.findByCustomerId(id);
			}

			List<CustomerLogResponse> logs = customerLogRepository.findAllByCustomer(customer.getId()).stream()
					.map(CustomerLogMapper::toResponse).collect(Collectors.toList());

			Log.infof("Customer id=%s fetched successfully with %d log(s) for ownerId=%s", id, logs.size(), ownerId);

			return prepareResponse.successMessageWithObject("Customer fetched successfully",
					CustomerMapper.toResponse(customer, logs, client));
		} catch (Exception e) {
			Log.errorf("Failed to fetch customer %s for ownerId %s: %s", id, ownerId, e.getMessage());
			return prepareResponse.failureMessage("Failed to fetch customer");
		}
	}

	/**
	 * Creates a new customer. Persists any logs provided in the request.
	 */
	@Transactional
	public RestResponse<GenericResponse> createCustomer(CustomerRequest request, String ownerId) {
		Log.debugf("Creating customer with email='%s' for ownerId=%s", request.getPrimaryEmail(), ownerId);
		try {
			if (customerRepository.existsByEmailAndOwner(request.getPrimaryEmail(), ownerId)) {
				Log.warnf("Duplicate email '%s' on create for ownerId=%s", request.getPrimaryEmail(), ownerId);
				return prepareResponse.conflict("Customer with this email already exists");
			}

			CustomerEntity entity = CustomerMapper.toEntity(request, ownerId);
			customerRepository.persist(entity);
			Log.infof("Customer created with id=%s for ownerId=%s", entity.getId(), ownerId);

			if (request.getLogs() != null && !request.getLogs().isEmpty()) {
				List<CustomerLogEntity> logs = request.getLogs().stream()
						.map(logReq -> CustomerLogMapper.toEntity(logReq, ownerId, entity.getId()))
						.collect(Collectors.toList());
				logs.forEach(customerLogRepository::persist);
				Log.infof("Persisted %d initial log(s) for customer id=%s", logs.size(), entity.getId());
			}

			return prepareResponse.successMessageWithObject("Customer created successfully",
					CustomerMapper.toResponse(entity));
		} catch (Exception e) {
			Log.errorf("Failed to create customer for ownerId %s: %s", ownerId, e.getMessage());
			return prepareResponse.failureMessage("Failed to create customer");
		}
	}

	/**
	 * Updates an existing customer. Appends any new logs provided in the request.
	 */
	@Transactional
	public RestResponse<GenericResponse> updateCustomer(UUID id, CustomerRequest request, String ownerId) {
		Log.debugf("Updating customer id=%s for ownerId=%s", id, ownerId);
		try {
			CustomerEntity customer = customerRepository.findByIdAndOwner(id, ownerId).orElse(null);
			if (customer == null) {
				Log.warnf("Customer id=%s not found or does not belong to ownerId=%s on update", id, ownerId);
				return prepareResponse.badRequest("Customer not found");
			}

			String incomingEmail = request.getPrimaryEmail().toLowerCase().trim();
			if (!customer.getPrimaryEmail().equals(incomingEmail)
					&& customerRepository.existsByEmailAndOwner(incomingEmail, ownerId)) {
				Log.warnf("Email conflict on update — email='%s' already used for ownerId=%s", incomingEmail, ownerId);
				return prepareResponse.conflict("Customer with this email already exists");
			}

			// Update customer fields
			customer.setFirstName(request.getFirstName().trim());
			customer.setLastName(request.getLastName().trim());
//			customer.setProfilePicture(request.getProfilePicture());
			customer.setPrimaryEmail(incomingEmail);
			customer.setSecondaryEmail(
					request.getSecondaryEmail() != null ? request.getSecondaryEmail().toLowerCase().trim() : null);
			customer.setPrimaryContactNo(request.getPrimaryContactNo());
			customer.setSecondaryContactNo(request.getSecondaryContactNo());
			customer.setRole(request.getRole());
			customer.setDesignation(request.getDesignation());
			customer.setCompany(request.getCompany());
			customer.setAddressStreet(request.getAddressStreet());
			customer.setAddressNumber(request.getAddressNumber());
			customer.setAddressPostcode(request.getAddressPostcode());
			customer.setAddressCity(request.getAddressCity());
			customer.setAddressState(request.getAddressState());
			customer.setAddressCountry(request.getAddressCountry());
			customer.setSocialLinkedin(request.getSocialLinkedin());
			customer.setSocialTwitter(request.getSocialTwitter());
			customer.setSocialYoutube(request.getSocialYoutube());
			customer.setLastContactedDate(request.getLastContactedDate());
			customer.setReferredBy(request.getReferredBy());
			customerRepository.persist(customer);
			Log.infof("Customer id=%s fields updated for ownerId=%s", id, ownerId);

			// Handle logs
			if (request.getLogs() != null && !request.getLogs().isEmpty()) {
				Log.debugf("Processing %d log(s) for customer id=%s", request.getLogs().size(), id);
				int updated = 0, added = 0;
				for (CustomerLogRequest logReq : request.getLogs()) {
					if (logReq.getId() != null) {
						// Edit existing log
						CustomerLogEntity existing = customerLogRepository
								.findByIdAndCustomerId(logReq.getId(), customer.getId()).orElse(null);
						if (existing == null) {
							Log.warnf("Log %s not found or does not belong to customer %s — skipping", logReq.getId(),
									customer.getId());
							continue;
						}
						existing.setType(logReq.getType());
						existing.setDescription(logReq.getDescription());
						existing.setDuration(logReq.getDuration());
						existing.setDate(logReq.getDate());
						customerLogRepository.persist(existing);
						updated++;
					} else {
						// Add new log
						CustomerLogEntity newLog = CustomerLogMapper.toEntity(logReq, ownerId, customer.getId());
						customerLogRepository.persist(newLog);
						added++;
					}
				}
				Log.infof("Logs processed for customer id=%s — %d updated, %d added", id, updated, added);
			}

			return prepareResponse.successMessageWithObject("Customer updated successfully",
					CustomerMapper.toResponse(customer));

		} catch (Exception e) {
			Log.errorf("Failed to update customer %s for ownerId %s: %s", id, ownerId, e.getMessage());
			return prepareResponse.failureMessage("Failed to update customer");
		}
	}

	/**
	 * Soft-deletes a customer.
	 */
	@Transactional
	public RestResponse<GenericResponse> deleteCustomer(UUID id, String ownerId) {
		Log.debugf("Soft-deleting customer id=%s for ownerId=%s", id, ownerId);
		try {
			CustomerEntity customer = customerRepository.findByIdAndOwner(id, ownerId).orElse(null);
			if (customer == null) {
				Log.warnf("Customer id=%s not found or does not belong to ownerId=%s on delete", id, ownerId);
				return prepareResponse.badRequest("Customer not found");
			}
			customer.setIsDeleted(true);
			customerRepository.persist(customer);
			Log.infof("Customer id=%s soft-deleted for ownerId=%s", id, ownerId);
			return prepareResponse.successMessage("Customer deleted successfully");
		} catch (Exception e) {
			Log.errorf("Failed to delete customer %s for ownerId %s: %s", id, ownerId, e.getMessage());
			return prepareResponse.failureMessage("Failed to delete customer");
		}
	}

	@Transactional
	public RestResponse<GenericResponse> addLog(UUID customerId, CustomerLogRequest request, String ownerId) {
		Log.debugf("Adding log for customer id=%s by ownerId=%s", customerId, ownerId);
		try {
			CustomerEntity customer = customerRepository.findByIdAndOwner(customerId, ownerId).orElse(null);
			if (customer == null) {
				Log.warnf("Customer id=%s not found or does not belong to ownerId=%s on addLog", customerId, ownerId);
				return prepareResponse.badRequest("Customer not found");
			}

			CustomerLogEntity log = CustomerLogMapper.toEntity(request, ownerId, customerId);
			customerLogRepository.persist(log);
			Log.infof("Log id=%s added for customer id=%s by ownerId=%s", log.getId(), customerId, ownerId);

			return prepareResponse.successMessageWithObject("Log added", CustomerLogMapper.toResponse(log));
		} catch (Exception e) {
			Log.errorf("Failed to add log for customer %s: %s", customerId, e.getMessage());
			return prepareResponse.failureMessage("Failed to add log");
		}
	}

	@Transactional
	public RestResponse<GenericResponse> editLog(UUID customerId, UUID logId, CustomerLogRequest request,
			String ownerId) {
		Log.debugf("Editing log id=%s for customer id=%s by ownerId=%s", logId, customerId, ownerId);
		try {
			CustomerEntity customer = customerRepository.findByIdAndOwner(customerId, ownerId).orElse(null);
			if (customer == null) {
				Log.warnf("Customer id=%s not found or does not belong to ownerId=%s on editLog", customerId, ownerId);
				return prepareResponse.badRequest("Customer not found");
			}

			CustomerLogEntity log = customerLogRepository.findByIdAndCustomerId(logId, customerId).orElse(null);
			if (log == null) {
				Log.warnf("Log id=%s not found for customer id=%s", logId, customerId);
				return prepareResponse.badRequest("Log not found for this customer");
			}

			log.setType(request.getType().trim());
			log.setDescription(request.getDescription());
			log.setDuration(request.getDuration());
			log.setDate(request.getDate());
			customerLogRepository.persist(log);
			Log.infof("Log id=%s updated for customer id=%s by ownerId=%s", logId, customerId, ownerId);

			return prepareResponse.successMessageWithObject("Log updated", CustomerLogMapper.toResponse(log));
		} catch (Exception e) {
			Log.errorf("Failed to edit log %s for customer %s: %s", logId, customerId, e.getMessage());
			return prepareResponse.failureMessage("Failed to update log");
		}
	}

	@Transactional
	public RestResponse<GenericResponse> deleteLog(UUID customerId, UUID logId, String ownerId) {
		Log.debugf("Deleting log id=%s for customer id=%s by ownerId=%s", logId, customerId, ownerId);
		try {
			CustomerEntity customer = customerRepository.findByIdAndOwner(customerId, ownerId).orElse(null);
			if (customer == null) {
				Log.warnf("Customer id=%s not found or does not belong to ownerId=%s on deleteLog", customerId,
						ownerId);
				return prepareResponse.badRequest("Customer not found");
			}

			CustomerLogEntity log = customerLogRepository.findByIdAndCustomerId(logId, customerId).orElse(null);
			if (log == null) {
				Log.warnf("Log id=%s not found for customer id=%s on delete", logId, customerId);
				return prepareResponse.badRequest("Log not found for this customer");
			}

			customerLogRepository.delete(log);
			Log.infof("Log id=%s deleted for customer id=%s by ownerId=%s", logId, customerId, ownerId);
			return prepareResponse.successMessage("Log deleted successfully");
		} catch (Exception e) {
			Log.errorf("Failed to delete log %s for customer %s: %s", logId, customerId, e.getMessage());
			return prepareResponse.failureMessage("Failed to delete log");
		}
	}

	@Transactional
	public RestResponse<GenericResponse> addProfilePic(UUID id, FileUpload file, String ownerId) {
		Log.debugf("Adding profile picture for customer id=%s by ownerId=%s", id, ownerId);
		try {
			CustomerEntity customer = customerRepository.findByIdAndOwner(id, ownerId).orElse(null);
			if (customer == null) {
				Log.warnf("Customer id=%s not found or does not belong to ownerId=%s on addProfilePic", id, ownerId);
				return prepareResponse.badRequest("Customer not found");
			}

			if (customer.getProfilePicture() != null) {
				Log.warnf("Customer id=%s already has a profile picture — use editProfilePic to update", id);
				return prepareResponse.badRequest("Profile picture already exists. Use editProfilePic to update it.");
			}

			Map<String, String> result = cloudinaryService.uploadWithOptions(file.uploadedFile().toFile(), "customers",
					id + "/profile");

			String secureUrl = result.get("secure_url");
			customer.setProfilePicture(secureUrl);
			customerRepository.persist(customer);
			Log.infof("Profile picture uploaded for customer id=%s, url=%s", id, secureUrl);

			return prepareResponse.successMessageWithObject("Profile picture added successfully",
					Map.of("profilePicture", secureUrl));

		} catch (Exception e) {
			Log.errorf("Failed to add profile pic for customer %s: %s", id, e.getMessage());
			return prepareResponse.failureMessage("Failed to upload profile picture");
		}
	}

	@Transactional
	public RestResponse<GenericResponse> editProfilePic(UUID id, FileUpload file, String ownerId) {
		Log.debugf("Updating profile picture for customer id=%s by ownerId=%s", id, ownerId);
		try {
			CustomerEntity customer = customerRepository.findByIdAndOwner(id, ownerId).orElse(null);
			if (customer == null) {
				Log.warnf("Customer id=%s not found or does not belong to ownerId=%s on editProfilePic", id, ownerId);
				return prepareResponse.badRequest("Customer not found");
			}

			if (customer.getProfilePicture() != null) {
				String publicId = "customers/" + id + "/profile";
				Log.debugf("Deleting existing Cloudinary image with publicId=%s for customer id=%s", publicId, id);
				cloudinaryService.deleteFile(publicId);
			}

			Map<String, String> result = cloudinaryService.uploadWithOptions(file.uploadedFile().toFile(), "customers",
					id + "/profile");

			String secureUrl = result.get("secure_url");
			customer.setProfilePicture(secureUrl);
			customerRepository.persist(customer);
			Log.infof("Profile picture updated for customer id=%s, url=%s", id, secureUrl);

			return prepareResponse.successMessageWithObject("Profile picture updated successfully",
					Map.of("profilePicture", secureUrl));

		} catch (Exception e) {
			Log.errorf("Failed to edit profile pic for customer %s: %s", id, e.getMessage());
			return prepareResponse.failureMessage("Failed to update profile picture");
		}
	}

	@Transactional
	public RestResponse<GenericResponse> deleteProfilePic(UUID id, String ownerId) {
		Log.debugf("Deleting profile picture for customer id=%s by ownerId=%s", id, ownerId);
		try {
			CustomerEntity customer = customerRepository.findByIdAndOwner(id, ownerId).orElse(null);
			if (customer == null) {
				Log.warnf("Customer id=%s not found or does not belong to ownerId=%s on deleteProfilePic", id, ownerId);
				return prepareResponse.badRequest("Customer not found");
			}

			if (customer.getProfilePicture() == null) {
				Log.warnf("Customer id=%s has no profile picture to delete", id);
				return prepareResponse.badRequest("No profile picture to delete");
			}

			String publicId = "customers/" + id + "/profile";
			Log.debugf("Deleting Cloudinary image with publicId=%s for customer id=%s", publicId, id);
			cloudinaryService.deleteFile(publicId);

			customer.setProfilePicture(null);
			customerRepository.persist(customer);
			Log.infof("Profile picture deleted for customer id=%s by ownerId=%s", id, ownerId);

			return prepareResponse.successMessage("Profile picture deleted successfully");

		} catch (Exception e) {
			Log.errorf("Failed to delete profile pic for customer %s: %s", id, e.getMessage());
			return prepareResponse.failureMessage("Failed to delete profile picture");
		}
	}

	// 1. Get all soft-deleted customers
	public RestResponse<GenericResponse> getDeletedCustomers(String ownerId) {
		Log.debugf("Fetching soft-deleted customers for ownerId=%s", ownerId);
		try {
			List<Object> data = customerRepository.findDeletedByOwner(ownerId).stream().map(CustomerMapper::toResponse)
					.collect(Collectors.toList());
			Log.infof("Fetched %d soft-deleted customer(s) for ownerId=%s", data.size(), ownerId);
			return prepareResponse.successMessageWithObject("Deleted customers fetched", data);
		} catch (Exception e) {
			Log.errorf("Failed to fetch deleted customers for ownerId %s: %s", ownerId, e.getMessage());
			return prepareResponse.failureMessage("Failed to fetch deleted customers");
		}
	}

	// 2. Restore a soft-deleted customer
	@Transactional
	public RestResponse<GenericResponse> restoreCustomer(UUID id, String ownerId) {
		Log.debugf("Restoring customer id=%s for ownerId=%s", id, ownerId);
		try {
			CustomerEntity customer = customerRepository.findDeletedByIdAndOwner(id, ownerId).orElse(null);
			if (customer == null) {
				Log.warnf("Deleted customer id=%s not found for ownerId=%s on restore", id, ownerId);
				return prepareResponse.badRequest("Deleted customer not found");
			}
			customer.setIsDeleted(false);
			customerRepository.persist(customer);
			Log.infof("Customer id=%s restored successfully for ownerId=%s", id, ownerId);
			return prepareResponse.successMessageWithObject("Customer restored successfully",
					CustomerMapper.toResponse(customer));
		} catch (Exception e) {
			Log.errorf("Failed to restore customer %s for ownerId %s: %s", id, ownerId, e.getMessage());
			return prepareResponse.failureMessage("Failed to restore customer");
		}
	}

	// 3. Permanently delete from DB
	@Transactional
	public RestResponse<GenericResponse> permanentlyDeleteCustomer(UUID id, String ownerId) {
		Log.debugf("Permanently deleting customer id=%s for ownerId=%s", id, ownerId);
		try {
			CustomerEntity customer = customerRepository.findDeletedByIdAndOwner(id, ownerId).orElse(null);
			if (customer == null) {
				Log.warnf("Deleted customer id=%s not found for ownerId=%s on permanent delete", id, ownerId);
				return prepareResponse.badRequest("Deleted customer not found");
			}

			customerLogRepository.delete("customerId = ?1", customer.getId());
			Log.debugf("Deleted all logs for customer id=%s before permanent removal", customer.getId());

			customerRepository.delete(customer);
			Log.infof("Customer id=%s permanently deleted for ownerId=%s", id, ownerId);

			return prepareResponse.successMessage("Customer permanently deleted");
		} catch (Exception e) {
			Log.errorf("Failed to permanently delete customer %s for ownerId %s: %s", id, ownerId, e.getMessage());
			return prepareResponse.failureMessage("Failed to permanently delete customer");
		}
	}
}