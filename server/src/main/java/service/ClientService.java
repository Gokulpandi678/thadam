package service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.jboss.resteasy.reactive.RestResponse;

import entity.ClientEntity;
import entity.CustomerEntity;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import mapper.ClientMapper;
import mapper.CustomerLogMapper;
import repositories.ClientRepository;
import repositories.CustomerLogRepository;
import repositories.CustomerRepository;
import request.ClientRequest;
import response.ClientFilterOptionsResponse;
import response.CustomerLogResponse;
import response.GenericResponse;
import response.PageResponse;
import response.PrepareResponse;

@ApplicationScoped
@RequiredArgsConstructor
public class ClientService {

    private static final int DEFAULT_PAGE_SIZE = 20;
    
   
    private final ClientRepository clientRepository;
    private final CustomerRepository customerRepository;
    private final CustomerLogRepository customerLogRepository;
    private final PrepareResponse prepareResponse;

    // ── List ──────────────────────────────────────────────────────────────────

    /**
     * Paginated client list with optional search and multi-value filters.
     * Joins clients + customers — response has BOTH tables' data.
     * Mirrors getCustomers() in CustomerService exactly.
     */
    public RestResponse<GenericResponse> getClients(
            String ownerId,
            String search,
            List<String> clientTypes,
            List<String> engagementTypes,
            int page) {

        Log.debugf("Fetching clients for ownerId=%s, page=%d, search='%s', clientTypes=%s, engagementTypes=%s",
                ownerId, page, search, clientTypes, engagementTypes);
        try {
            long totalElements = clientRepository.countSearchAndFilter(
                    ownerId, search, clientTypes, engagementTypes);
            int totalPages = (int) Math.ceil((double) totalElements / DEFAULT_PAGE_SIZE);

            List<Object> data = clientRepository
                    .searchAndFilter(ownerId, search, clientTypes, engagementTypes, page, DEFAULT_PAGE_SIZE)
                    .stream()
                    .map(row -> (Object) ClientMapper.toResponse(
                            (ClientEntity) row[0],
                            (CustomerEntity) row[1]))
                    .collect(Collectors.toList());

            Log.infof("Fetched %d clients (page %d/%d) for ownerId=%s", data.size(), page + 1, totalPages, ownerId);

            PageResponse pageResponse = PageResponse.builder()
                    .data(data)
                    .totalElements(totalElements)
                    .totalPages(totalPages)
                    .currentPage(page)
                    .pageSize(DEFAULT_PAGE_SIZE)
                    .hasNext(page < totalPages - 1)
                    .hasPrevious(page > 0)
                    .build();

            return prepareResponse.successMessageWithObject("Clients fetched successfully", pageResponse);
        } catch (Exception e) {
            Log.errorf("Failed to fetch clients for ownerId %s: %s", ownerId, e.getMessage());
            return prepareResponse.failureMessage("Failed to fetch clients");
        }
    }

    /**
     * Filter options for client table dropdowns.
     * Mirrors getFilterOptions() in CustomerService.
     */
    public RestResponse<GenericResponse> getClientFilterOptions(String ownerId) {
        Log.debugf("Fetching client filter options for ownerId=%s", ownerId);
        try {
            ClientFilterOptionsResponse options = ClientFilterOptionsResponse.builder()
                    .clientTypes(clientRepository.findDistinctClientTypes(ownerId))
                    .engagementTypes(clientRepository.findDistinctEngagementTypes(ownerId))
                    .build();

            Log.infof("Client filter options fetched for ownerId=%s, clientTypes=%d, engagementTypes=%d",
                    ownerId, options.getClientTypes().size(), options.getEngagementTypes().size());

            return prepareResponse.successMessageWithObject("Client filter options fetched successfully", options);
        } catch (Exception e) {
            Log.errorf("Failed to fetch client filter options for ownerId %s: %s", ownerId, e.getMessage());
            return prepareResponse.failureMessage("Failed to fetch client filter options");
        }
    }

    // ── Single fetch ──────────────────────────────────────────────────────────

    /**
     * Full client detail: client table data + full customer table data + meeting logs.
     * One endpoint — detail page needs nothing else.
     */
    public RestResponse<GenericResponse> getClient(UUID customerId, String ownerId) {
        Log.debugf("Fetching client profile for customerId=%s, ownerId=%s", customerId, ownerId);
        try {
            CustomerEntity customer = customerRepository.findByIdAndOwner(customerId, ownerId).orElse(null);
            if (customer == null) {
                Log.warnf("Customer id=%s not found or does not belong to ownerId=%s on getClient", customerId, ownerId);
                return prepareResponse.badRequest("Customer not found");
            }

            ClientEntity client = clientRepository.findByCustomerIdAndOwner(customerId, ownerId).orElse(null);
            if (client == null) {
                Log.warnf("No client record found for customerId=%s, ownerId=%s", customerId, ownerId);
                return prepareResponse.badRequest("This contact has not been converted to a client yet");
            }

            List<CustomerLogResponse> logs = customerLogRepository.findAllByCustomer(customerId).stream()
                    .map(CustomerLogMapper::toResponse)
                    .collect(Collectors.toList());

            Log.infof("Client profile fetched for customerId=%s with %d log(s)", customerId, logs.size());

            return prepareResponse.successMessageWithObject("Client fetched successfully",
                    ClientMapper.toResponse(client, customer, logs));

        } catch (Exception e) {
            Log.errorf("Failed to fetch client for customerId=%s, ownerId=%s: %s", customerId, ownerId, e.getMessage());
            return prepareResponse.failureMessage("Failed to fetch client");
        }
    }

    // ── Convert ───────────────────────────────────────────────────────────────

    @Transactional
    public RestResponse<GenericResponse> convertAsClient(UUID customerId, ClientRequest request, String ownerId) {
        Log.debugf("Converting customerId=%s to client for ownerId=%s", customerId, ownerId);
        try {
            CustomerEntity customer = customerRepository.findByIdAndOwner(customerId, ownerId).orElse(null);
            if (customer == null) {
                Log.warnf("Customer id=%s not found or does not belong to ownerId=%s", customerId, ownerId);
                return prepareResponse.badRequest("Customer not found");
            }

            if (clientRepository.existsByCustomerId(customerId)) {
                Log.warnf("Customer id=%s is already a client for ownerId=%s", customerId, ownerId);
                return prepareResponse.conflict("This contact is already a client");
            }

            ClientEntity client = ClientMapper.toEntity(request, ownerId, customerId);
            clientRepository.persist(client);
            Log.infof("Client record created with id=%s for customerId=%s", client.getId(), customerId);

            // Update role on customers table → shows "Client" badge in contacts list
            customer.setRole("Client");
            customerRepository.persist(customer);
            Log.infof("Customer id=%s role updated to 'Client'", customerId);

            return prepareResponse.successMessageWithObject("Contact successfully converted to client",
                    ClientMapper.toResponse(client, customer));

        } catch (Exception e) {
            Log.errorf("Failed to convert customerId=%s for ownerId=%s: %s", customerId, ownerId, e.getMessage());
            return prepareResponse.failureMessage("Failed to convert contact to client");
        }
    }

    // ── Update ────────────────────────────────────────────────────────────────

    @Transactional
    public RestResponse<GenericResponse> updateClient(UUID customerId, ClientRequest request, String ownerId) {
        Log.debugf("Updating client for customerId=%s, ownerId=%s", customerId, ownerId);
        try {
            CustomerEntity customer = customerRepository.findByIdAndOwner(customerId, ownerId).orElse(null);
            if (customer == null) return prepareResponse.badRequest("Customer not found");

            ClientEntity client = clientRepository.findByCustomerIdAndOwner(customerId, ownerId).orElse(null);
            if (client == null) return prepareResponse.badRequest("Client record not found");

            client.setClientType(request.getClientType());
            client.setClientSince(request.getClientSince());
            client.setConversionReason(request.getConversionReason());
            client.setValueTags(request.getValueTags());
            client.setEngagementType(request.getEngagementType());
            client.setNextFollowUp(request.getNextFollowUp());
            client.setNotes(request.getNotes());
            clientRepository.persist(client);

            Log.infof("Client record updated for customerId=%s by ownerId=%s", customerId, ownerId);

            return prepareResponse.successMessageWithObject("Client updated successfully",
                    ClientMapper.toResponse(client, customer));

        } catch (Exception e) {
            Log.errorf("Failed to update client for customerId=%s: %s", customerId, e.getMessage());
            return prepareResponse.failureMessage("Failed to update client");
        }
    }

    // ── Revert ────────────────────────────────────────────────────────────────

    @Transactional
    public RestResponse<GenericResponse> revertClient(UUID customerId, String ownerId) {
        Log.debugf("Reverting client for customerId=%s, ownerId=%s", customerId, ownerId);
        try {
            CustomerEntity customer = customerRepository.findByIdAndOwner(customerId, ownerId).orElse(null);
            if (customer == null) return prepareResponse.badRequest("Customer not found");

            ClientEntity client = clientRepository.findByCustomerIdAndOwner(customerId, ownerId).orElse(null);
            if (client == null) return prepareResponse.badRequest("Client record not found");

            clientRepository.delete(client);
            Log.infof("Client record deleted for customerId=%s", customerId);

            // Revert role back to Lead on customers table
            customer.setRole("Lead");
            customerRepository.persist(customer);
            Log.infof("Customer id=%s role reverted to 'Lead'", customerId);

            return prepareResponse.successMessage("Client reverted to contact successfully");

        } catch (Exception e) {
            Log.errorf("Failed to revert client for customerId=%s: %s", customerId, e.getMessage());
            return prepareResponse.failureMessage("Failed to revert client");
        }
    }
}