package service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.jboss.resteasy.reactive.RestResponse;

import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import lombok.RequiredArgsConstructor;
import repositories.CustomerLogRepository;
import repositories.CustomerRepository;
import response.DashboardResponse;
import response.EngagedContactDTO;
import response.GenericResponse;
import response.PrepareResponse;
import response.RecentContactDTO;

@ApplicationScoped
@RequiredArgsConstructor
public class DashboardService {
	
	private final CustomerRepository customerRepository;
	private final CustomerLogRepository customerLogRepository;
	private final PrepareResponse prepareResponse;

//	public RestResponse<GenericResponse> getDashboard(String ownerId) {
//		try {
//			// ── Summary counts ────────────────────────────────────────────
//			long totalContacts       = customerRepository.count("ownerId = ?1 and isDeleted = false", ownerId);
//			long meetingsThisMonth   = customerLogRepository.countMeetingsThisMonth(ownerId);
//			long differentCompanies  = customerRepository.countDistinctCompanies(ownerId);
//			long totalLogs           = customerLogRepository.countAllByOwner(ownerId);
//
//			// ── Contacts by role ──────────────────────────────────────────
//			List<Map<String, Object>> contactsByRole = customerRepository.countByRole(ownerId).stream()
//					.map(row -> {
//						Map<String, Object> m = new HashMap<>();
//						m.put("type", row[0]);
//						m.put("count", row[1]);
//						return m;
//					}).collect(Collectors.toList());
//
//			// ── Contacts by city ──────────────────────────────────────────
//			List<Map<String, Object>> contactsByCity = customerRepository.countByCity(ownerId).stream()
//					.map(row -> {
//						Map<String, Object> m = new HashMap<>();
//						m.put("type", row[0]);
//						m.put("count", row[1]);
//						return m;
//					}).collect(Collectors.toList());
//
//			// ── Contacts by state ─────────────────────────────────────────
//			List<Map<String, Object>> contactsByState = customerRepository.countByState(ownerId).stream()
//					.map(row -> {
//						Map<String, Object> m = new HashMap<>();
//						m.put("type", row[0]);
//						m.put("count", row[1]);
//						return m;
//					}).collect(Collectors.toList());
//
//			// ── Recently added 5 contacts ─────────────────────────────────
//			List<CustomerResponse> recentContacts = customerRepository.findRecent5(ownerId).stream()
//					.map(CustomerMapper::toResponse)
//					.collect(Collectors.toList());
//
//			// ── Most met contacts (top 5 by log count) ────────────────────
//			List<Map<String, Object>> mostMetContacts = new ArrayList<>();
//			for (Object[] row : customerLogRepository.findTop5MostMet(ownerId)) {
//				UUID customerId = (UUID) row[0];
//				Long logCount   = (Long)  row[1];
//
//				customerRepository.findByIdOptional(customerId).ifPresent(c -> {
//					Map<String, Object> entry = new HashMap<>();
//					entry.put("contact",  CustomerMapper.toResponse(c));
//					entry.put("logCount", logCount);
//					mostMetContacts.add(entry);
//				});
//			}
//
//			DashboardResponse dashboard = DashboardResponse.builder()
//					.totalContacts(totalContacts)
//					.meetingsThisMonth(meetingsThisMonth)
//					.differentCompanies(differentCompanies)
//					.totalLogs(totalLogs)
//					.contactsByRole(contactsByRole)
//					.contactsByCity(contactsByCity)
//					.contactsByState(contactsByState)
//					.recentContacts(recentContacts)
//					.mostMetContacts(mostMetContacts)
//					.build();
//
//			return prepareResponse.successMessageWithObject("Dashboard fetched successfully", dashboard);
//		} catch (Exception e) {
//			Log.errorf("Failed to fetch dashboard for ownerId %s: %s", ownerId, e.getMessage());
//			return prepareResponse.failureMessage("Failed to fetch dashboard");
//		}
//	}
	
	
	// service/DashboardService.java
	public RestResponse<GenericResponse> getDashboard(String ownerId) {
	    try {
	        DashboardResponse dashboard = DashboardResponse.builder()
	            .stats(buildStats(ownerId))
	            .recentContacts(buildRecentContacts(ownerId))
	            .mostEngaged(buildMostEngaged(ownerId))
	            .distributions(buildDistributions(ownerId))
	            .build();

	        return prepareResponse.successMessageWithObject("Dashboard fetched", dashboard);
	    } catch (Exception e) {
	        Log.errorf("getDashboard failed for %s: %s", ownerId, e.getMessage());
	        return prepareResponse.failureMessage("Failed to fetch dashboard");
	    }
	}

	// ── private builders ──────────────────────────────────────────────────────

	private Map<String, Long> buildStats(String ownerId) {
	    return Map.of(
	        "totalContacts",      customerRepository.count("ownerId = ?1 and isDeleted = false", ownerId),
	        "meetingsThisMonth",  customerLogRepository.countMeetingsThisMonth(ownerId),
	        "differentCompanies", customerRepository.countDistinctCompanies(ownerId),
	        "totalLogs",          customerLogRepository.countAllByOwner(ownerId)
	    );
	}
	

	private List<RecentContactDTO> buildRecentContacts(String ownerId) {
	    return customerRepository.findRecent5(ownerId).stream()
	        .map(c -> RecentContactDTO.builder()
	            .id(c.getId().toString())
	            .name(c.getFirstName() + " " + c.getLastName())
	            .addedAgo(format(c.getCreatedAt()))
	            .company(c.getCompany())
	            .designation(c.getDesignation())
	            .build())
	        .toList();
	}

	private List<EngagedContactDTO> buildMostEngaged(String ownerId) {
	    List<EngagedContactDTO> result = new ArrayList<>();
	    for (Object[] row : customerLogRepository.findTop5MostMet(ownerId)) {
	        UUID customerId = (UUID) row[0];
	        Long meetCount  = (Long)  row[1];
	        customerRepository.findByIdOptional(customerId).ifPresent(c ->
	            result.add(EngagedContactDTO.builder()
	                .id(c.getId().toString())
	                .name(c.getFirstName() + " " + c.getLastName())
	                .meetCount(meetCount)
	                .company(c.getCompany())
		            .designation(c.getDesignation())
	                .build())
	        );
	    }
	    return result;
	}

	private Map<String, Object> buildDistributions(String ownerId) {
	    return Map.of(
	        "byRole",  toTypeCountList(customerRepository.countByRole(ownerId)),
	        "byCity",  toTypeCountList(customerRepository.countByCity(ownerId)),
	        "byState", toTypeCountList(customerRepository.countByState(ownerId))
	    );
	}

	private List<Map<String, Object>> toTypeCountList(List<Object[]> rows) {
	    return rows.stream()
	        .map(row -> Map.of("type", row[0], "count", row[1]))
	        .collect(Collectors.toList());
	}
	
	 public static String format(LocalDateTime dateTime) {
	        if (dateTime == null) return "unknown";
	        
	        LocalDateTime now = LocalDateTime.now();
	        long days = ChronoUnit.DAYS.between(dateTime, now);
	        
	        if (days == 0) {
	            long hours = ChronoUnit.HOURS.between(dateTime, now);
	            if (hours == 0) {
	                long minutes = ChronoUnit.MINUTES.between(dateTime, now);
	                if (minutes == 0) return "just now";
	                return minutes + " minute" + (minutes != 1 ? "s" : "") + " ago";
	            }
	            return hours + " hour" + (hours != 1 ? "s" : "") + " ago";
	        } else if (days == 1) {
	            return "yesterday";
	        } else if (days < 7) {
	            return days + " days ago";
	        } else if (days < 30) {
	            long weeks = days / 7;
	            return weeks + " week" + (weeks != 1 ? "s" : "") + " ago";
	        } else {
	            long months = days / 30;
	            return months + " month" + (months != 1 ? "s" : "") + " ago";
	        }
	    }
}
