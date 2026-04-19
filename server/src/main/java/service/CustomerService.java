package service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import entity.CustomerEntity;
import entity.CustomerLogEntity;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import mapper.CustomerLogMapper;
import mapper.CustomerMapper;
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
public class CustomerService {

	private static final int DEFAULT_PAGE_SIZE = 20;

	@Inject
	CustomerRepository customerRepository;

	@Inject
	CustomerLogRepository customerLogRepository;

	@Inject
	PrepareResponse prepareResponse;
	
	@Inject
	CloudinaryService cloudinaryService;

	/**
	 * Paginated customer list with optional search and multi-value filters.
	 */
	public RestResponse<GenericResponse> getCustomers(String ownerId, String search, List<String> roles,
			List<String> designations, List<String> cities, int page) {
		try {
			long totalElements = customerRepository.countSearchAndFilter(ownerId, search, roles, designations, cities);

			int totalPages = (int) Math.ceil((double) totalElements / DEFAULT_PAGE_SIZE);

			List<Object> data = customerRepository
					.searchAndFilter(ownerId, search, roles, designations, cities, page, DEFAULT_PAGE_SIZE).stream()
					.map(CustomerMapper::toResponse).collect(Collectors.toList());

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
		try {
			FilterOptionsResponse options = FilterOptionsResponse.builder()
					.roles(customerRepository.findDistinctRoles(ownerId))
					.designations(customerRepository.findDistinctDesignations(ownerId))
					.cities(customerRepository.findDistinctCities(ownerId)).build();
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
		try {
			CustomerEntity customer = customerRepository.findByIdAndOwner(id, ownerId).orElse(null);
			if (customer == null) {
				return prepareResponse.badRequest("Customer not found");
			}

			List<CustomerLogResponse> logs = customerLogRepository.findAllByCustomer(customer.getId()).stream()
					.map(CustomerLogMapper::toResponse).collect(Collectors.toList());

			return prepareResponse.successMessageWithObject("Customer fetched successfully",
					CustomerMapper.toResponse(customer, logs));
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
		try {
			if (customerRepository.existsByEmailAndOwner(request.getPrimaryEmail(), ownerId)) {
				return prepareResponse.conflict("Customer with this email already exists");
			}

			CustomerEntity entity = CustomerMapper.toEntity(request, ownerId);
			customerRepository.persist(entity);

			if (request.getLogs() != null && !request.getLogs().isEmpty()) {
				List<CustomerLogEntity> logs = request.getLogs().stream()
						.map(logReq -> CustomerLogMapper.toEntity(logReq, ownerId, entity.getId()))
						.collect(Collectors.toList());
				logs.forEach(customerLogRepository::persist);
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
		try {
			CustomerEntity customer = customerRepository.findByIdAndOwner(id, ownerId).orElse(null);
			if (customer == null) {
				return prepareResponse.badRequest("Customer not found");
			}

			String incomingEmail = request.getPrimaryEmail().toLowerCase().trim();
			if (!customer.getPrimaryEmail().equals(incomingEmail)
					&& customerRepository.existsByEmailAndOwner(incomingEmail, ownerId)) {
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

			// Handle logs
			if (request.getLogs() != null && !request.getLogs().isEmpty()) {
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
					} else {
						// Add new log
						CustomerLogEntity newLog = CustomerLogMapper.toEntity(logReq, ownerId, customer.getId());
						customerLogRepository.persist(newLog);
					}
				}
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
		try {
			CustomerEntity customer = customerRepository.findByIdAndOwner(id, ownerId).orElse(null);
			if (customer == null) {
				return prepareResponse.badRequest("Customer not found");
			}
			customer.setIsDeleted(true);
			customerRepository.persist(customer);
			return prepareResponse.successMessage("Customer deleted successfully");
		} catch (Exception e) {
			Log.errorf("Failed to delete customer %s for ownerId %s: %s", id, ownerId, e.getMessage());
			return prepareResponse.failureMessage("Failed to delete customer");
		}
	}
	
	@Transactional
	public RestResponse<GenericResponse> addLog(UUID customerId, CustomerLogRequest request, String ownerId) {
	    try {
	        CustomerEntity customer = customerRepository.findByIdAndOwner(customerId, ownerId).orElse(null);
	        if (customer == null) return prepareResponse.badRequest("Customer not found");

	        CustomerLogEntity log = CustomerLogMapper.toEntity(request, ownerId, customerId);
	        customerLogRepository.persist(log);

	        return prepareResponse.successMessageWithObject("Log added", CustomerLogMapper.toResponse(log));
	    } catch (Exception e) {
	        Log.errorf("Failed to add log for customer %s: %s", customerId, e.getMessage());
	        return prepareResponse.failureMessage("Failed to add log");
	    }
	}
	
	@Transactional
	public RestResponse<GenericResponse> editLog(UUID customerId, UUID logId,
			CustomerLogRequest request, String ownerId) {
		try {
			// Verify customer ownership
			CustomerEntity customer = customerRepository.findByIdAndOwner(customerId, ownerId).orElse(null);
			if (customer == null) return prepareResponse.badRequest("Customer not found");

			// Verify log belongs to this customer
			CustomerLogEntity log = customerLogRepository.findByIdAndCustomerId(logId, customerId).orElse(null);
			if (log == null) return prepareResponse.badRequest("Log not found for this customer");

			log.setType(request.getType().trim());
			log.setDescription(request.getDescription());
			log.setDuration(request.getDuration());
			log.setDate(request.getDate());
			customerLogRepository.persist(log);

			return prepareResponse.successMessageWithObject("Log updated", CustomerLogMapper.toResponse(log));
		} catch (Exception e) {
			Log.errorf("Failed to edit log %s for customer %s: %s", logId, customerId, e.getMessage());
			return prepareResponse.failureMessage("Failed to update log");
		}
	}

	@Transactional
	public RestResponse<GenericResponse> deleteLog(UUID customerId, UUID logId, String ownerId) {
		try {
			// Verify customer ownership
			CustomerEntity customer = customerRepository.findByIdAndOwner(customerId, ownerId).orElse(null);
			if (customer == null) return prepareResponse.badRequest("Customer not found");

			// Verify log belongs to this customer
			CustomerLogEntity log = customerLogRepository.findByIdAndCustomerId(logId, customerId).orElse(null);
			if (log == null) return prepareResponse.badRequest("Log not found for this customer");

			customerLogRepository.delete(log);
			return prepareResponse.successMessage("Log deleted successfully");
		} catch (Exception e) {
			Log.errorf("Failed to delete log %s for customer %s: %s", logId, customerId, e.getMessage());
			return prepareResponse.failureMessage("Failed to delete log");
		}
	}

	
	@Transactional
	public RestResponse<GenericResponse> addProfilePic(UUID id, FileUpload file, String ownerId) {
	    try {
	        CustomerEntity customer = customerRepository.findByIdAndOwner(id, ownerId).orElse(null);
	        if (customer == null) return prepareResponse.badRequest("Customer not found");

	        if (customer.getProfilePicture() != null) {
	            return prepareResponse.badRequest("Profile picture already exists. Use editProfilePic to update it.");
	        }

	        // Upload to Cloudinary with a stable public_id so we can delete it later
//	        String publicId = "customers/" + id + "/profile";
	        Map<String, String> result = cloudinaryService.uploadWithOptions(
	                file.uploadedFile().toFile(), "customers", id + "/profile");

	        String secureUrl = (String) result.get("secure_url");
	        customer.setProfilePicture(secureUrl);
	        customerRepository.persist(customer);

	        return prepareResponse.successMessageWithObject(
	                "Profile picture added successfully",
	                Map.of("profilePicture", secureUrl));

	    } catch (Exception e) {
	        Log.errorf("Failed to add profile pic for customer %s: %s", id, e.getMessage());
	        return prepareResponse.failureMessage("Failed to upload profile picture");
	    }
	}

	@Transactional
	public RestResponse<GenericResponse> editProfilePic(UUID id, FileUpload file, String ownerId) {
	    try {
	        CustomerEntity customer = customerRepository.findByIdAndOwner(id, ownerId).orElse(null);
	        if (customer == null) return prepareResponse.badRequest("Customer not found");

	        // Delete old image from Cloudinary if it exists
	        if (customer.getProfilePicture() != null) {
	            String publicId = "customers/" + id + "/profile";
	            cloudinaryService.deleteFile(publicId);
	        }

	        // Upload new image
	        Map<String,String> result = cloudinaryService.uploadWithOptions(
	                file.uploadedFile().toFile(), "customers", id + "/profile");

	        String secureUrl = (String) result.get("secure_url");
	        customer.setProfilePicture(secureUrl);
	        customerRepository.persist(customer);

	        return prepareResponse.successMessageWithObject(
	                "Profile picture updated successfully",
	                Map.of("profilePicture", secureUrl));

	    } catch (Exception e) {
	        Log.errorf("Failed to edit profile pic for customer %s: %s", id, e.getMessage());
	        return prepareResponse.failureMessage("Failed to update profile picture");
	    }
	}

	@Transactional
	public RestResponse<GenericResponse> deleteProfilePic(UUID id, String ownerId) {
	    try {
	        CustomerEntity customer = customerRepository.findByIdAndOwner(id, ownerId).orElse(null);
	        if (customer == null) return prepareResponse.badRequest("Customer not found");

	        if (customer.getProfilePicture() == null) {
	            return prepareResponse.badRequest("No profile picture to delete");
	        }

	        // Delete from Cloudinary
	        String publicId = "customers/" + id + "/profile";
	        cloudinaryService.deleteFile(publicId);

	        // Clear URL in DB
	        customer.setProfilePicture(null);
	        customerRepository.persist(customer);

	        return prepareResponse.successMessage("Profile picture deleted successfully");

	    } catch (Exception e) {
	        Log.errorf("Failed to delete profile pic for customer %s: %s", id, e.getMessage());
	        return prepareResponse.failureMessage("Failed to delete profile picture");
	    }
	}
}