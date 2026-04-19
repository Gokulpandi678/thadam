package response;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PageResponse {

    private List<Object> data;
    private long totalElements;
    private int totalPages;
    private int currentPage;
    private int pageSize;
    private boolean hasNext;
    private boolean hasPrevious;
}