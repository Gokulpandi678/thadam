package response;

import java.util.List;
import java.util.Map;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardResponse {
    private Map<String, Long>        stats;
    private List<RecentContactDTO>   recentContacts;
    private List<EngagedContactDTO>  mostEngaged;
    private Map<String, Object>      distributions;
}