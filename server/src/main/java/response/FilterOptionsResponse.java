package response;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FilterOptionsResponse {

    private List<String> roles;
    private List<String> designations;
    private List<String> cities;
}