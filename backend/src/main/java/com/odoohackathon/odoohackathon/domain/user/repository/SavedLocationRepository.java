package com.odoohackathon.odoohackathon.domain.user.repository;

import com.odoohackathon.odoohackathon.domain.user.entity.SavedLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedLocationRepository extends JpaRepository<SavedLocation, Long> {
    List<SavedLocation> findByUserId(Long userId);
}
