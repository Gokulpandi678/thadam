package repositories;

import java.time.LocalDate;
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

    public long countMeetingsThisMonth(String ownerId) {

        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate startOfNextMonth = startOfMonth.plusMonths(1);

        return getEntityManager()
                .createQuery(
                    "select count(l) from CustomerLogEntity l " +
                    "join CustomerEntity c on c.id = l.customerId " +
                    "where c.ownerId = :ownerId and c.isDeleted = false " +
                    "and lower(l.type) = 'meet' " +
                    "and l.date >= :startOfMonth " +
                    "and l.date < :startOfNextMonth",
                    Long.class)
                .setParameter("ownerId", ownerId)
                .setParameter("startOfMonth", startOfMonth)
                .setParameter("startOfNextMonth", startOfNextMonth)
                .getSingleResult();
    }

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
