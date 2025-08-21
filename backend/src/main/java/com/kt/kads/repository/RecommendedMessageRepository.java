package com.kt.kads.repository;

import com.kt.kads.entity.RecommendedMessage;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RecommendedMessageRepository extends JpaRepository<RecommendedMessage, Long> {

    @Query(value = """
        SELECT * FROM recommended_messages
        WHERE is_active = true
          AND (
                :category IS NULL OR :category = '' 
                OR category = :category 
                OR category ILIKE ('%%' || :category || '%%')
              )
          AND (
                :channel IS NULL OR :channel = '' 
                OR channel = :channel
              )
        ORDER BY -LN(random()) / GREATEST(weight,1) ASC
        LIMIT 1
        """, nativeQuery = true)
    Optional<RecommendedMessage> pickRandom(
            @Param("category") String category,
            @Param("channel")  String channel
    );
}
