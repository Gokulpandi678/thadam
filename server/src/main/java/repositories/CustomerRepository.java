package repositories;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import entity.CustomerEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CustomerRepository implements PanacheRepositoryBase<CustomerEntity, UUID> {

    public List<CustomerEntity> findAllByOwner(String ownerId) {
        return list("ownerId = ?1 and isDeleted = false", ownerId);
    }

    public Optional<CustomerEntity> findByIdAndOwner(UUID id, String ownerId) {
        return find("id = ?1 and ownerId = ?2 and isDeleted = false", id, ownerId).firstResultOptional();
    }

    public boolean existsByEmailAndOwner(String email, String ownerId) {
        return count("primaryEmail = ?1 and ownerId = ?2 and isDeleted = false", email, ownerId) > 0;
    }

    /**
     * Paginated search and filter.
     * Search: firstName, lastName, primaryEmail, company (case-insensitive)
     * Filters: role, designation, addressCity (multi-value OR per field)
     */
    public List<CustomerEntity> searchAndFilter(
            String ownerId,
            String search,
            List<String> roles,
            List<String> designations,
            List<String> cities,
            int page,
            int size) {

        StringBuilder query = new StringBuilder("ownerId = :ownerId and isDeleted = false");
        Map<String, Object> params = new HashMap<>();
        params.put("ownerId", ownerId);

        appendSearchClause(query, params, search);
        appendInClause(query, params, "role", "roles", roles);
        appendInClause(query, params, "designation", "designations", designations);
        appendInClause(query, params, "addressCity", "cities", cities);

        return find(query.toString(), params)
                .page(Page.of(page, size))
                .list();
    }

    public long countSearchAndFilter(
            String ownerId,
            String search,
            List<String> roles,
            List<String> designations,
            List<String> cities) {

        StringBuilder query = new StringBuilder("ownerId = :ownerId and isDeleted = false");
        Map<String, Object> params = new HashMap<>();
        params.put("ownerId", ownerId);

        appendSearchClause(query, params, search);
        appendInClause(query, params, "role", "roles", roles);
        appendInClause(query, params, "designation", "designations", designations);
        appendInClause(query, params, "addressCity", "cities", cities);

        return count(query.toString(), params);
    }

    // ── Filter option queries ─────────────────────────────────────────────────

    public List<String> findDistinctRoles(String ownerId) {
        return getEntityManager()
                .createQuery(
                    "select distinct e.role from CustomerEntity e " +
                    "where e.ownerId = :ownerId and e.isDeleted = false and e.role is not null " +
                    "order by e.role", String.class)
                .setParameter("ownerId", ownerId)
                .getResultList();
    }

    public List<String> findDistinctDesignations(String ownerId) {
        return getEntityManager()
                .createQuery(
                    "select distinct e.designation from CustomerEntity e " +
                    "where e.ownerId = :ownerId and e.isDeleted = false and e.designation is not null " +
                    "order by e.designation", String.class)
                .setParameter("ownerId", ownerId)
                .getResultList();
    }

    public List<String> findDistinctCities(String ownerId) {
        return getEntityManager()
                .createQuery(
                    "select distinct e.addressCity from CustomerEntity e " +
                    "where e.ownerId = :ownerId and e.isDeleted = false and e.addressCity is not null " +
                    "order by e.addressCity", String.class)
                .setParameter("ownerId", ownerId)
                .getResultList();
    }

    // ── Dashboard queries ─────────────────────────────────────────────────────

    /**
     * Count of non-deleted contacts per role for the given owner.
     * Returns Object[] rows: [role (String), count (Long)]
     */
    public List<Object[]> countByRole(String ownerId) {
        return getEntityManager()
                .createQuery(
                    "select e.role, count(e) from CustomerEntity e " +
                    "where e.ownerId = :ownerId and e.isDeleted = false and e.role is not null " +
                    "group by e.role order by count(e) desc",
                    Object[].class)
                .setParameter("ownerId", ownerId)
                .getResultList();
    }

    /**
     * Count of non-deleted contacts per city for the given owner.
     * Returns Object[] rows: [city (String), count (Long)]
     */
    public List<Object[]> countByCity(String ownerId) {
        return getEntityManager()
                .createQuery(
                    "select e.addressCity, count(e) from CustomerEntity e " +
                    "where e.ownerId = :ownerId and e.isDeleted = false and e.addressCity is not null " +
                    "group by e.addressCity order by count(e) desc",
                    Object[].class)
                .setParameter("ownerId", ownerId)
                .getResultList();
    }

    /**
     * Count of non-deleted contacts per state for the given owner.
     * Returns Object[] rows: [state (String), count (Long)]
     */
    public List<Object[]> countByState(String ownerId) {
        return getEntityManager()
                .createQuery(
                    "select e.addressState, count(e) from CustomerEntity e " +
                    "where e.ownerId = :ownerId and e.isDeleted = false and e.addressState is not null " +
                    "group by e.addressState order by count(e) desc",
                    Object[].class)
                .setParameter("ownerId", ownerId)
                .getResultList();
    }

    /**
     * Last 5 contacts added (newest first).
     */
    public List<CustomerEntity> findRecent5(String ownerId) {
        return getEntityManager()
                .createQuery(
                    "select e from CustomerEntity e " +
                    "where e.ownerId = :ownerId and e.isDeleted = false " +
                    "order by e.createdAt desc",
                    CustomerEntity.class)
                .setParameter("ownerId", ownerId)
                .setMaxResults(5)
                .getResultList();
    }

    /**
     * Count of distinct non-null companies for the given owner.
     */
    public long countDistinctCompanies(String ownerId) {
        return getEntityManager()
                .createQuery(
                    "select count(distinct e.company) from CustomerEntity e " +
                    "where e.ownerId = :ownerId and e.isDeleted = false and e.company is not null",
                    Long.class)
                .setParameter("ownerId", ownerId)
                .getSingleResult();
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private void appendSearchClause(StringBuilder query, Map<String, Object> params, String search) {
        if (search != null && !search.isBlank()) {
            String pattern = "%" + search.trim().toLowerCase() + "%";
            query.append(" and (lower(firstName) like :search" +
                    " or lower(lastName) like :search" +
                    " or lower(primaryEmail) like :search" +
                    " or lower(company) like :search)");
            params.put("search", pattern);
        }
    }

    private void appendInClause(StringBuilder query, Map<String, Object> params,
                                 String field, String paramKey, List<String> values) {
        if (values != null && !values.isEmpty()) {
            query.append(" and ").append(field).append(" in :").append(paramKey);
            params.put(paramKey, values);
        }
    }
}
