package repositories;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import entity.ClientEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

@ApplicationScoped
public class ClientRepository implements PanacheRepositoryBase<ClientEntity, UUID> {

    @Inject
    EntityManager em;

    // ── Simple lookups ────────────────────────────────────────────────────────

    public Optional<ClientEntity> findByCustomerId(UUID customerId) {
        return find("customerId = ?1", customerId).firstResultOptional();
    }

    public Optional<ClientEntity> findByCustomerIdAndOwner(UUID customerId, String ownerId) {
        return find("customerId = ?1 and ownerId = ?2", customerId, ownerId).firstResultOptional();
    }

    public boolean existsByCustomerId(UUID customerId) {
        return count("customerId = ?1", customerId) > 0;
    }

    // ── Paginated search + filter (joins clients → customers) ─────────────────
    // Returns Object[] rows: [ClientEntity, CustomerEntity]

    public List<Object[]> searchAndFilter(
            String ownerId,
            String search,
            List<String> clientTypes,
            List<String> engagementTypes,
            int page,
            int size) {

        StringBuilder jpql = buildBaseQuery(
            "select cl, cu from ClientEntity cl " +
            "join CustomerEntity cu on cu.id = cl.customerId ",
            ownerId, search, clientTypes, engagementTypes
        );
        jpql.append(" order by cl.createdAt desc");

        var query = em.createQuery(jpql.toString(), Object[].class);
        applyParams(query, ownerId, search, clientTypes, engagementTypes);
        query.setFirstResult(page * size);
        query.setMaxResults(size);

        return query.getResultList();
    }

    public long countSearchAndFilter(
            String ownerId,
            String search,
            List<String> clientTypes,
            List<String> engagementTypes) {

        StringBuilder jpql = buildBaseQuery(
            "select count(cl) from ClientEntity cl " +
            "join CustomerEntity cu on cu.id = cl.customerId ",
            ownerId, search, clientTypes, engagementTypes
        );

        var query = em.createQuery(jpql.toString(), Long.class);
        applyParams(query, ownerId, search, clientTypes, engagementTypes);
        return query.getSingleResult();
    }

    // ── Filter option queries ─────────────────────────────────────────────────

    public List<String> findDistinctClientTypes(String ownerId) {
        return em.createQuery(
            "select distinct cl.clientType from ClientEntity cl " +
            "where cl.ownerId = :ownerId and cl.clientType is not null " +
            "order by cl.clientType", String.class)
            .setParameter("ownerId", ownerId)
            .getResultList();
    }

    public List<String> findDistinctEngagementTypes(String ownerId) {
        return em.createQuery(
            "select distinct cl.engagementType from ClientEntity cl " +
            "where cl.ownerId = :ownerId and cl.engagementType is not null " +
            "order by cl.engagementType", String.class)
            .setParameter("ownerId", ownerId)
            .getResultList();
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private StringBuilder buildBaseQuery(
            String select,
            String ownerId,
            String search,
            List<String> clientTypes,
            List<String> engagementTypes) {

        StringBuilder jpql = new StringBuilder(select);
        jpql.append("where cl.ownerId = :ownerId and cu.isDeleted = false");

        if (search != null && !search.isBlank()) {
            jpql.append(" and (lower(cu.firstName) like :s or lower(cu.lastName) like :s" +
                        " or lower(cu.primaryEmail) like :s or lower(cu.company) like :s)");
        }
        if (clientTypes != null && !clientTypes.isEmpty()) {
            jpql.append(" and cl.clientType in :clientTypes");
        }
        if (engagementTypes != null && !engagementTypes.isEmpty()) {
            jpql.append(" and cl.engagementType in :engagementTypes");
        }
        return jpql;
    }

    private <T> void applyParams(
            jakarta.persistence.TypedQuery<T> query,
            String ownerId,
            String search,
            List<String> clientTypes,
            List<String> engagementTypes) {

        query.setParameter("ownerId", ownerId);
        if (search != null && !search.isBlank()) {
            query.setParameter("s", "%" + search.trim().toLowerCase() + "%");
        }
        if (clientTypes != null && !clientTypes.isEmpty()) {
            query.setParameter("clientTypes", clientTypes);
        }
        if (engagementTypes != null && !engagementTypes.isEmpty()) {
            query.setParameter("engagementTypes", engagementTypes);
        }
    }
}