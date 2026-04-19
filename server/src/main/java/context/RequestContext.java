package context;

import jakarta.enterprise.context.RequestScoped;
import lombok.Getter;
import lombok.Setter;

@RequestScoped
@Getter
@Setter
public class RequestContext {

    private String userId;
    private String deviceId;
    private long requestStartTime;
    
}