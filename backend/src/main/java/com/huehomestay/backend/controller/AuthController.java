package com.huehomestay.backend.controller;

import com.huehomestay.backend.dto.AuthRequest;
import com.huehomestay.backend.dto.AuthResponse;
import com.huehomestay.backend.dto.RegisterRequest;
import com.huehomestay.backend.entity.Role;
import com.huehomestay.backend.entity.User;
import com.huehomestay.backend.repository.UserRepository;
import com.huehomestay.backend.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email đã tồn tại trong hệ thống"));
            }

            Role userRole = "HOST".equals(request.getRole()) ? Role.HOST : Role.USER;

            User user = User.builder()
                    .name(request.getName())
                    .email(request.getEmail())
                    .phone(request.getPhone())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(userRole)
                    .build();

            User savedUser = userRepository.save(user);

            // TODO: If role == HOST, create a Homestay entity here.

            return ResponseEntity.status(201).body(Map.of("message", "Đăng ký thành công", "user", savedUser));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Lỗi hệ thống, vui lòng thử lại sau"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Tài khoản hoặc mật khẩu không đúng"));
        }

        User user = optionalUser.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Tài khoản hoặc mật khẩu không đúng"));
        }

        // Generate real JWT token
        String jwtToken = jwtService.generateToken(user);

        AuthResponse response = AuthResponse.builder()
                .message("Đăng nhập thành công")
                .token(jwtToken)
                .user(user)
                .build();

        return ResponseEntity.ok(response);
    }
}
