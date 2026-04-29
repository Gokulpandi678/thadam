package service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.jboss.resteasy.reactive.RestResponse;

import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import lombok.RequiredArgsConstructor;
import repositories.CustomerLogRepository;
import repositories.CustomerRepository;
import response.DashboardResponse;
import response.EngagedContactDTO;
import response.GenericResponse;
import response.PrepareResponse;
import response.RecentContactDTO;
import response.StatDelta;

@ApplicationScoped
@RequiredArgsConstructor
public class DashboardService {

	private final CustomerRepository customerRepository;
	private final CustomerLogRepository customerLogRepository;
	private final PrepareResponse prepareResponse;

	// service/DashboardService.java
	public RestResponse<GenericResponse> getDashboard(String ownerId) {
		try {
			DashboardResponse dashboard = DashboardResponse.builder().stats(buildStats(ownerId))
					.recentContacts(buildRecentContacts(ownerId)).mostEngaged(buildMostEngaged(ownerId))
					.distributions(buildDistributions(ownerId)).build();

			return prepareResponse.successMessageWithObject("Dashboard fetched", dashboard);
		} catch (Exception e) {
			Log.errorf("getDashboard failed for %s: %s", ownerId, e.getMessage());
			return prepareResponse.failureMessage("Failed to fetch dashboard");
		}
	}

	// ── private builders ──────────────────────────────────────────────────────

	private Map<String, StatDelta> buildStats(String ownerId) {
		long totalContacts = 0, newThisMonth = 0, newLastMonth = 0;
		long meetingsThisMonth = 0, meetingsLastMonth = 0;
		long companies = 0, companiesLastMonth = 0;
		long totalLogs = 0, totalLogsLastMonth = 0;

		LocalDateTime startOfThisMonth = YearMonth.now().atDay(1).atStartOfDay();

		try {
			totalContacts = customerRepository.count("ownerId = ?1 and isDeleted = false", ownerId);
		} catch (Exception e) {
			Log.error(e);
		}
		try {
			newThisMonth = customerRepository.countNewThisMonth(ownerId);
		} catch (Exception e) {
			Log.error(e);
		}
		try {
			newLastMonth = customerRepository.countNewLastMonth(ownerId);
		} catch (Exception e) {
			Log.error(e);
		}
		try {
			meetingsThisMonth = customerLogRepository.countMeetingsThisMonth(ownerId);
		} catch (Exception e) {
			Log.error(e);
		}
		try {
			meetingsLastMonth = customerLogRepository.countMeetingsLastMonth(ownerId);
		} catch (Exception e) {
			Log.error(e);
		}

		// Companies: total now vs total before this month started
		try {
			companies = customerRepository.countDistinctCompanies(ownerId);
		} catch (Exception e) {
			Log.error(e);
		}
		try {
			companiesLastMonth = customerRepository.countDistinctCompaniesBefore(ownerId, startOfThisMonth);
		} catch (Exception e) {
			Log.error(e);
		}

		// Total logs: total now vs total before this month started
		try {
			totalLogs = customerLogRepository.countAllByOwner(ownerId);
		} catch (Exception e) {
			Log.error(e);
		}
		try {
			totalLogsLastMonth = customerLogRepository.countAllByOwnerBefore(ownerId, startOfThisMonth);
		} catch (Exception e) {
			Log.error(e);
		}

		return Map.of("totalContacts", delta(totalContacts, newLastMonth, newThisMonth), "meetingsThisMonth",
				delta(meetingsThisMonth, meetingsLastMonth, meetingsThisMonth), "differentCompanies",
				delta(companies, companiesLastMonth, companies - companiesLastMonth), "totalLogs",
				delta(totalLogs, totalLogsLastMonth, totalLogs - totalLogsLastMonth));
	}

	/** Builds a StatDelta comparing thisMonth vs lastMonth. */
	private StatDelta delta(long currentValue, long last, long current) {
		double percent = 0;
		String trend = "same";

		if (last == 0 && current > 0) {
			percent = 100.0;
			trend = "up";
		} else if (last > 0) {
			percent = ((double) (current - last) / last) * 100.0;
			trend = percent > 0 ? "up" : percent < 0 ? "down" : "same";
		}

		return StatDelta.builder().value(currentValue).percent(Math.abs(Math.round(percent * 10.0) / 10.0)).trend(trend)
				.build();
	}

	private List<RecentContactDTO> buildRecentContacts(String ownerId) {
		return customerRepository.findRecent5(ownerId).stream()
				.map(c -> RecentContactDTO.builder().id(c.getId().toString())
						.name(c.getFirstName() + " " + c.getLastName()).addedAgo(format(c.getCreatedAt()))
						.company(c.getCompany()).designation(c.getDesignation()).build())
				.toList();
	}

	private List<EngagedContactDTO> buildMostEngaged(String ownerId) {
		List<EngagedContactDTO> result = new ArrayList<>();
		for (Object[] row : customerLogRepository.findTop5MostMet(ownerId)) {
			UUID customerId = (UUID) row[0];
			Long meetCount = (Long) row[1];
			customerRepository.findByIdOptional(customerId)
					.ifPresent(c -> result.add(EngagedContactDTO.builder().id(c.getId().toString())
							.name(c.getFirstName() + " " + c.getLastName()).meetCount(meetCount).company(c.getCompany())
							.designation(c.getDesignation()).build()));
		}
		return result;
	}

	private Map<String, Object> buildDistributions(String ownerId) {
		return Map.of("byRole", toTypeCountList(customerRepository.countByRole(ownerId)), "byCity",
				toTypeCountList(customerRepository.countByCity(ownerId)), "byState",
				toTypeCountList(customerRepository.countByState(ownerId)));
	}

	private List<Map<String, Object>> toTypeCountList(List<Object[]> rows) {
		return rows.stream().map(row -> Map.of("type", row[0], "count", row[1])).collect(Collectors.toList());
	}

	public static String format(LocalDateTime dateTime) {
		if (dateTime == null)
			return "unknown";

		LocalDateTime now = LocalDateTime.now();
		long days = ChronoUnit.DAYS.between(dateTime, now);

		if (days == 0) {
			long hours = ChronoUnit.HOURS.between(dateTime, now);
			if (hours == 0) {
				long minutes = ChronoUnit.MINUTES.between(dateTime, now);
				if (minutes == 0)
					return "just now";
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
