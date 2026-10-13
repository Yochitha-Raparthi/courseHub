
package com.courseDetails.coursePortal.controller;

import com.courseDetails.coursePortal.dto.LoginRequest;
import com.courseDetails.coursePortal.dto.SignupRequest;
import com.courseDetails.coursePortal.model.AppUser;
import com.courseDetails.coursePortal.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;

    public AuthController(
            AuthService authService,
            AuthenticationManager authenticationManager,
            SecurityContextRepository securityContextRepository) {
        this.authService = authService;
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @Valid @RequestBody SignupRequest request) {

        AppUser user = authService.register(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
            Map.of(
                "message", "Account created successfully",
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail()
            )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        try {
            Authentication authentication =
                authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                        request.email().trim().toLowerCase(),
                        request.password()
                    )
                );

            SecurityContext context =
                SecurityContextHolder.createEmptyContext();

            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);

            securityContextRepository.saveContext(
                context, httpRequest, httpResponse
            );

            return ResponseEntity.ok(
                Map.of(
                    "message", "Login successful",
                    "email", authentication.getName(),
                    "role", authentication.getAuthorities()
                        .stream()
                        .findFirst()
                        .map(Object::toString)
                        .orElse("ROLE_USER")
                )
            );

        } catch (AuthenticationException ex) {
            SecurityContextHolder.clearContext();

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                    "message", "Invalid email or password"
                ));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> currentUser(
            Authentication authentication) {

        return ResponseEntity.ok(
            Map.of("email", authentication.getName())
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            HttpServletRequest request) {

        SecurityContextHolder.clearContext();

        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        return ResponseEntity.ok(
            Map.of("message", "Logged out successfully")
        );
    }
}