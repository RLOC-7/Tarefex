package com.system.system.config;

import com.system.system.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

  private final JwtUtil jwtUtil;
  private final UserRepository userRepository;

  public JwtAuthFilter(JwtUtil jwtUtil, UserRepository userRepository) {
    this.jwtUtil = jwtUtil;
    this.userRepository = userRepository;
  }
  
  @SuppressWarnings("null")
  @Override
  protected void doFilterInternal(HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {

    String authHeader = request.getHeader("Authorization");
    System.out.println("DEBUG: Header Authorization: " + (authHeader != null ? "Presente" : "Ausente"));

    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      String token = authHeader.substring(7);
      System.out.println("DEBUG: Token recebido (prefixo): " + token.substring(0, Math.min(token.length(), 10)));

      if (jwtUtil.validarToken(token)) {
        String email = jwtUtil.extrairEmail(token);
        System.out.println("DEBUG: Token válido para: " + email);

        // Verifica se o usuário existe e autentica na SecurityContext
        userRepository.findByEmail(email).ifPresent(usuario -> {
          UserDetails userDetails = User.builder()
              .username(usuario.getEmail())
              .password(usuario.getPassword())
              .authorities("USER")
              .build();

          UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userDetails, null,
              userDetails.getAuthorities());

          SecurityContextHolder.getContext().setAuthentication(auth);
          System.out.println("DEBUG: Autenticação definida no SecurityContext para: " + email);
        });
      } else {
        System.out.println("DEBUG: Falha na validação do Token JWT");
      }
    }

    filterChain.doFilter(request, response);
  }
}
