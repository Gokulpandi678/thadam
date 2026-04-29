package response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EngagedContactDTO {
    private String id;
    private String name;
    private long meetCount;
    private String company;
    private String designation;
}