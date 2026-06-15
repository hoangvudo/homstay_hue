package com.huehomestay.backend.config;

import com.huehomestay.backend.entity.Role;
import com.huehomestay.backend.entity.User;
import com.huehomestay.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            userRepository.findByEmail("admin@huehomestay.com").ifPresentOrElse(
                admin -> {
                    admin.setPassword(passwordEncoder.encode("admin123"));
                    userRepository.save(admin);
                    System.out.println("====== SUPER ADMIN PASSWORD RESET TO admin123 ======");
                },
                () -> {
                    User admin = User.builder()
                            .name("Super Admin")
                            .email("admin@huehomestay.com")
                            .phone("0901234567")
                            .password(passwordEncoder.encode("admin123"))
                            .role(Role.ADMIN)
                            .build();
                    userRepository.save(admin);
                    System.out.println("====== SUPER ADMIN CREATED SUCCESSFULLY ======");
                }
            );
        };
    }
}
