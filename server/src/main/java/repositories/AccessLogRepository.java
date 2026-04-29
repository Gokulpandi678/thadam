package repositories;

import entity.AccessLogEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class AccessLogRepository implements PanacheRepositoryBase<AccessLogEntity, UUID> {

    public List<AccessLogEntity> findByUserId(String userId) {
        return list("userId", userId);
    }

    public List<AccessLogEntity> findByDeviceId(String deviceId) {
        return list("deviceId", deviceId);
    }
}