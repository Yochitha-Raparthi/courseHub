package com.courseDetails.coursePortal.config;

import com.courseDetails.coursePortal.model.AppUser;
import com.courseDetails.coursePortal.repo.UserRepository;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(
            UserRepository userRepository) {

        return email -> {
            AppUser appUser = userRepository.findByEmail(email)
                .orElseThrow(() ->
                    new UsernameNotFoundException("User not found"));

            return User.withUsername(appUser.getEmail())
                .password(appUser.getPassword())
                .roles(appUser.getRole())
                .build();
        };
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cors = new CorsConfiguration();
        cors.setAllowedOrigins(List.of("http://localhost:5173"));
        cors.setAllowedMethods(
            List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        );
        cors.setAllowedHeaders(List.of("Content-Type", "X-XSRF-TOKEN"));
        cors.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", cors);
        return source;
    }


@Bean
public SecurityFilterChain securityFilterChain(
        HttpSecurity http) throws Exception {

    http
        .cors(cors -> {})
        // Kept as in your current learning version.
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth

            // Anyone can create an account or attempt login.
            .requestMatchers(
                "/auth/signup",
                "/auth/login",
                "/auth/logout"
            ).permitAll()

            // Logged-in users can view courses.
            .requestMatchers(
                HttpMethod.GET,
                "/course/**"
            ).hasAnyRole("USER", "ADMIN")

            // Only admins can create courses.
            .requestMatchers(
                HttpMethod.POST,
                "/course/**"
            ).hasRole("ADMIN")

            // Only admins can update courses.
            .requestMatchers(
                HttpMethod.PUT,
                "/course/**"
            ).hasRole("ADMIN")

            .requestMatchers(
                HttpMethod.PATCH,
                "/course/**"
            ).hasRole("ADMIN")

            // Only admins can delete courses.
            .requestMatchers(
                HttpMethod.DELETE,
                "/course/**"
            ).hasRole("ADMIN")

            // Other endpoints require login.
            .anyRequest().authenticated()
        )
        .sessionManagement(session ->
            session.sessionCreationPolicy(
                SessionCreationPolicy.IF_REQUIRED
            )
        );

    return http.build();
}
}