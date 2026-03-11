package com.system.system.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;
import jakarta.validation.Valid;

import com.system.system.config.JwtUtil;
import com.system.system.model.Task;
import com.system.system.model.User;
import com.system.system.repository.UserRepository;
import com.system.system.service.TaskService;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

  private final TaskService service;
  private final JwtUtil jwtUtil;
  private final UserRepository userRepository;

  public TaskController(TaskService service, JwtUtil jwtUtil, UserRepository userRepository) {
    this.service = service;
    this.jwtUtil = jwtUtil;
    this.userRepository = userRepository;
  }

  @PostMapping
  public ResponseEntity<Task> criar(
      @RequestHeader(value = "Authorization") String authHeader,
      @Valid @RequestBody Task task) {

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    String token = authHeader.substring(7);
    String email = jwtUtil.extrairEmail(token);
    User user = userRepository.findByEmail(email).orElse(null);

    if (user == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    task.setUser(user);
    return ResponseEntity.status(HttpStatus.CREATED).body(service.salvar(task));
  }

  /** Retorna apenas as tarefas do usuário autenticado pelo token JWT */
  @GetMapping
  public ResponseEntity<List<Task>> listar(
      @RequestHeader(value = "Authorization", required = false) String authHeader) {

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    String token = authHeader.substring(7);
    if (!jwtUtil.validarToken(token)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    String email = jwtUtil.extrairEmail(token);
    User user = userRepository.findByEmail(email).orElse(null);
    if (user == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    return ResponseEntity.ok(service.buscarPorUsuario(user.getId()));
  }

  @GetMapping("/{id}")
  public ResponseEntity<Task> buscar(@PathVariable Long id) {
    return service.buscarPorId(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<List<Task>> listarPorUsuario(@PathVariable Long userId) {
    return ResponseEntity.ok(service.buscarPorUsuario(userId));
  }

  @PutMapping("/{id}")
  public ResponseEntity<Task> atualizar(@PathVariable Long id, @RequestBody Task task) {
    try {
      return ResponseEntity.ok(service.atualizar(id, task));
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deletar(@PathVariable Long id) {
    service.deletar(id);
    return ResponseEntity.noContent().build();
  }

  @PatchMapping("/{id}/complete")
  public ResponseEntity<Task> concluir(@PathVariable Long id) {
    return ResponseEntity.ok(service.marcarComoConcluida(id));
  }
}