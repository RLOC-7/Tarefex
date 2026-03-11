package com.system.system.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

  // Chave secreta — em produção, mova para application.properties
  private static final String SECRET = "tarefex-super-secret-key-2024-must-be-256-bits!!";
  private static final long EXPIRATION_MS = 86400000L; // 24 horas

  private SecretKey getKey() {
    return Keys.hmacShaKeyFor(SECRET.getBytes());
  }

  /** Gera um token JWT com o email do usuário como subject */
  public String gerarToken(String email) {
    return Jwts.builder()
        .subject(email)
        .issuedAt(new Date())
        .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
        .signWith(getKey())
        .compact();
  }

  /** Extrai o email (subject) do token */
  public String extrairEmail(String token) {
    return extrairClaims(token).getSubject();
  }

  /** Valida se o token é válido e não expirou */
  public boolean validarToken(String token) {
    try {
      extrairClaims(token);
      return true;
    } catch (Exception e) {
      return false;
    }
  }

  private Claims extrairClaims(String token) {
    return Jwts.parser()
        .verifyWith(getKey())
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }
}
