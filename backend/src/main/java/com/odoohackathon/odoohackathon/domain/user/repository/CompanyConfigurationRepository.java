package com.odoohackathon.odoohackathon.domain.user.repository;

import com.odoohackathon.odoohackathon.domain.user.entity.CompanyConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyConfigurationRepository extends JpaRepository<CompanyConfiguration, Long> {
    Optional<CompanyConfiguration> findByCompanyId(Long companyId);
}
