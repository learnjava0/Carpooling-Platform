package com.odoohackathon.odoohackathon.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String emailDomain; // To associate employees with a company via their email

    private String address;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;
}
