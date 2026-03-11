package com.system.system.controller;

import com.system.system.dto.LoginRequestDTO;
import com.system.system.dto.LoginResponseDTO;

import org.springframework.web.bind.annotation.RestController;

import com.system.system.dto.UserRequestDTO;
import com.system.system.dto.UserResponseDTO;
import com.system.system.dto.ChangePasswordDTO;
import com.system.system.model.User;
import com.system.system.service.UserService;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/user")
public class UserController {

  private final UserService service;

  public UserController(UserService service) {
    this.service = service;
  }

  @PostMapping("/login")
  public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO dto) {
    try {
      // Chama o service para autenticar
      LoginResponseDTO response = service.login(dto);
      return ResponseEntity.ok(response);
    } catch (RuntimeException e) {
      // Retorna 401 Unauthorized se email/senha inválidos
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(null);
    }
  }

  @GetMapping("/profile")
  public ResponseEntity<UserResponseDTO> perfil(
      @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
    try {
      if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      String token = authorizationHeader.substring(7);

      // Decodifica o JWT para encontrar o usuário correto
      User user = service.buscarUsuarioPorToken(token);
      if (user == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      return ResponseEntity.ok(new UserResponseDTO(
          user.getId(),
          user.getName(),
          user.getLastname(),
          user.getEmail(),
          user.getRazaoSocial(),
          user.getCreatedAt(),
          user.getBio()));

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PutMapping("/profile")
  public ResponseEntity<UserResponseDTO> atualizarPerfil(
      @RequestHeader(value = "Authorization") String authorizationHeader,
      @RequestBody UserRequestDTO dto) {
    try {
      if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      String token = authorizationHeader.substring(7);
      UserResponseDTO updated = service.atualizarPorToken(token, dto);
      return ResponseEntity.ok(updated);

    } catch (RuntimeException e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PutMapping("/password")
  public ResponseEntity<?> alterarSenha(
      @RequestHeader(value = "Authorization") String authorizationHeader,
      @RequestBody ChangePasswordDTO dto) {
    try {
      if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      String token = authorizationHeader.substring(7);
      
      service.alterarSenha(token, dto.getCurrentPassword(), dto.getNewPassword());
      
      return ResponseEntity.ok().build(); // 200 OK
    } catch (RuntimeException e) {
      // Retorna 400 Bad Request com a mensagem de erro (ex: "Senha incorreta")
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  // CREATE - Salva no MySQL
  @PostMapping
  public ResponseEntity<User> criar(@RequestBody UserRequestDTO dto) {
    return ResponseEntity.status(HttpStatus.CREATED).body(service.salvarNovoUsuario(dto));
  }

  // CREATE - Salva varios registros
  @PostMapping("/bulk")
  public ResponseEntity<List<User>> criarVarios(@RequestBody List<User> novosUsuarios) {
    return ResponseEntity.status(HttpStatus.CREATED).body(service.salvarMuitos(novosUsuarios));
  }

  // READ - Busca por ID
  @GetMapping("/{id}")
  public ResponseEntity<User> buscarPorId(@PathVariable Long id) {
    return service.buscarPorId(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  // READ ALL - Lista todos os registros do banco
  @GetMapping
  public ResponseEntity<List<User>> listarTodos() {
    List<User> lista = service.listarTodos();
    return ResponseEntity.ok(lista);
  }

  // UPDATE - Atualiza dados existentes
  @PutMapping("/{id}")
  public ResponseEntity<User> atualizar(@PathVariable Long id, @RequestBody User dados) {
    try {
      return ResponseEntity.ok(service.atualizar(id, dados));
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
    }

  }

  // DELETE - Remove do banco
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deletar(@PathVariable Long id) {
    service.deletar(id);
    return ResponseEntity.noContent().build();

  }
}
