package repositories;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import entity.CustomerLogEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CustomerLogRepository implements PanacheRepositoryBase<CustomerLogEntity, UUID> {

    public List<CustomerLogEntity> findAllByCustomer(UUID customerId) {
        return list("customerId = ?1 order by createdAt desc", customerId);
    }

    public Optional<CustomerLogEntity> findByIdAndCustomerId(UUID id, UUID customerId) {
        return find("id = ?1 and customerId = ?2", id, customerId).firstResultOptional();
    }

    public Optional<CustomerLogEntity> findByIdAndOwner(UUID logId, String ownerId) {
        return getEntityManager()
            .createQuery(
                "select l from CustomerLogEntity l " +
                "join CustomerEntity c on c.id = l.customerId " +
                "where l.id = :logId and c.ownerId = :ownerId and c.isDeleted = false",
                CustomerLogEntity.class)
            .setParameter("logId", logId)
            .setParameter("ownerId", ownerId)
            .getResultStream()
            .findFirst();
    }

    // Count all logs this month via createdAt (reliable — auto-set on persist)
    public long countMeetingsThisMonth(String ownerId) {
        LocalDateTime start = YearMonth.now().atDay(1).atStartOfDay();
        LocalDateTime end   = LocalDateTime.now();

        return getEntityManager()
            .createQuery(
                "select count(l) from CustomerLogEntity l " +
                "join CustomerEntity c on c.id = l.customerId " +
                "where c.ownerId = :ownerId and c.isDeleted = false " +
                "and l.createdAt >= :start and l.createdAt <= :end",
                Long.class)
            .setParameter("ownerId", ownerId)
            .setParameter("start", start)
            .setParameter("end", end)
            .getSingleResult();
    }

    // Count all logs last month via createdAt
    public long countMeetingsLastMonth(String ownerId) {
        YearMonth last      = YearMonth.now().minusMonths(1);
        LocalDateTime start = last.atDay(1).atStartOfDay();
        LocalDateTime end   = last.atEndOfMonth().atTime(23, 59, 59);

        return getEntityManager()
            .createQuery(
                "select count(l) from CustomerLogEntity l " +
                "join CustomerEntity c on c.id = l.customerId " +
                "where c.ownerId = :ownerId and c.isDeleted = false " +
                "and l.createdAt >= :start and l.createdAt <= :end",
                Long.class)
            .setParameter("ownerId", ownerId)
            .setParameter("start", start)
            .setParameter("end", end)
            .getSingleResult();
    }

    // Total logs ever for this owner
    public long countAllByOwner(String ownerId) {
        return getEntityManager()
            .createQuery(
                "select count(l) from CustomerLogEntity l " +
                "join CustomerEntity c on c.id = l.customerId " +
                "where c.ownerId = :ownerId and c.isDeleted = false",
                Long.class)
            .setParameter("ownerId", ownerId)
            .getSingleResult();
    }

    // Total logs before a given datetime (for delta calculation)
    public long countAllByOwnerBefore(String ownerId, LocalDateTime before) {
        return getEntityManager()
            .createQuery(
                "select count(l) from CustomerLogEntity l " +
                "join CustomerEntity c on c.id = l.customerId " +
                "where c.ownerId = :ownerId and c.isDeleted = false " +
                "and l.createdAt < :before",
                Long.class)
            .setParameter("ownerId", ownerId)
            .setParameter("before", before)
            .getSingleResult();
    }

    public List<Object[]> findTop5MostMet(String ownerId) {
        return getEntityManager()
            .createQuery(
                "select l.customerId, count(l) as cnt " +
                "from CustomerLogEntity l " +
                "join CustomerEntity c on c.id = l.customerId " +
                "where c.ownerId = :ownerId and c.isDeleted = false " +
                "group by l.customerId " +
                "order by cnt desc",
                Object[].class)
            .setParameter("ownerId", ownerId)
            .setMaxResults(5)
            .getResultList();
    }
}