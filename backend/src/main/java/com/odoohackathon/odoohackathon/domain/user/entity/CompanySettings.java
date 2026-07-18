package com.odoohackathon.odoohackathon.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "company_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanySettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(targetEntity = Company.class, fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "company_id")
    private Company company;

    @Column(nullable = false)
    @Builder.Default
    private BigDecimal baseFare = new BigDecimal("50.00");

    @Column(nullable = false)
    @Builder.Default
    private BigDecimal fuelCostPerKm = new BigDecimal("8.50");

    @Column(nullable = false)
    @Builder.Default
    private BigDecimal travelCostDeduction = new BigDecimal("5.00");
}
