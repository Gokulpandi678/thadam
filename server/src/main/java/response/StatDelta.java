package response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StatDelta {
    private long value;
    private double percent;
    private String trend;
}