package com.sneha.logisticsmarketplace.repository;

import com.sneha.logisticsmarketplace.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}