package com.odoohackathon.odoohackathon.domain.user.repository;

import com.odoohackathon.odoohackathon.domain.user.entity.Company;
import com.odoohackathon.odoohackathon.domain.user.entity.CompanySettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanySettingsRepository extends JpaRepository<CompanySettings, Long> {
    Optional<CompanySettings> findByCompany(Company company);
}
