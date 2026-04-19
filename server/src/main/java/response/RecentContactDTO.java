package response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecentContactDTO {
    private String id;
    private String name;
    private String addedAgo;
    private String company;
    private String designation;
}