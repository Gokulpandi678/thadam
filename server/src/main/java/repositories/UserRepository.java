package repositories;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import entity.UserEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class UserRepository implements PanacheRepositoryBase<UserEntity, UUID> {

    public Optional<UserEntity> findByUserId(String userId) {
        return find("userId", userId).firstResultOptional();
    }

    public Optional<UserEntity> findByEmail(String email) {
        return find("email", email).firstResultOptional();
    }

    @Transactional
    public UserEntity upsertUser(UserEntity incomingUser) {
        Optional<UserEntity> existing = findByUserId(incomingUser.getUserId());

        if (existing.isPresent()) {
        	UserEntity user = existing.get();
            user.setLastLoggedIn(LocalDateTime.now());
            persist(user);
            return user;
        }

        persist(incomingUser);
        return incomingUser;
    }

}