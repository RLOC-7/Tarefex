package com.system.system.controller;

import com.system.system.config.JwtUtil;
import com.system.system.model.Category;
import com.system.system.model.User;
import com.system.system.repository.UserRepository;
import com.system.system.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

  private final CategoryService categoryService;
  private final JwtUtil jwtUtil;
  private final UserRepository userRepository;

  public CategoryController(CategoryService categoryService, JwtUtil jwtUtil, UserRepository userRepository) {
    this.categoryService = categoryService;
    this.jwtUtil = jwtUtil;
    this.userRepository = userRepository;
  }

  @GetMapping
  public ResponseEntity<List<Category>> listar(
      @RequestHeader(value = "Authorization") String authHeader) {
    System.out.println("DEBUG: GET /api/categories - Header recebido");
    User user = extrairUsuario(authHeader);
    if (user == null) {
      System.out.println("DEBUG: GET /api/categories - Usuário não autenticado");
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    return ResponseEntity.ok(categoryService.listarPorUsuario(user));
  }

  @PostMapping
  public ResponseEntity<Category> criar(
      @RequestHeader(value = "Authorization") String authHeader,
      @RequestBody Category category) {
    System.out.println("DEBUG: POST /api/categories - Iniciado");
    User user = extrairUsuario(authHeader);
    if (user == null) {
      System.out.println("DEBUG: POST /api/categories - Usuário não autenticado");
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    category.setUser(user);
    Category salva = categoryService.salvar(category);
    System.out.println("DEBUG: POST /api/categories - Salvo com sucesso: " + salva.getName());
    return ResponseEntity.status(HttpStatus.CREATED).body(salva);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Category> atualizar(
      @RequestHeader(value = "Authorization") String authHeader,
      @PathVariable Long id,
      @RequestBody Category categoryDetails) {
    System.out.println("DEBUG: PUT /api/categories/" + id + " - Iniciado");
    User user = extrairUsuario(authHeader);
    if (user == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    return categoryService.buscarPorId(id)
        .map(existingCategory -> {
          // Verifica se a categoria pertence ao usuário
          if (!existingCategory.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).<Category>build();
          }

          existingCategory.setName(categoryDetails.getName());
          existingCategory.setColor(categoryDetails.getColor());
          existingCategory.setIcon(categoryDetails.getIcon());
          // O 'value' geralmente não muda para evitar quebrar associações de tarefas
          // existentes,
          // a menos que queiramos migrar as tarefas também.
          // Por enquanto, mantemos o value original.

          Category atualizada = categoryService.salvar(existingCategory);
          return ResponseEntity.ok(atualizada);
        })
        .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deletar(
      @RequestHeader(value = "Authorization") String authHeader,
      @PathVariable Long id) {
    User user = extrairUsuario(authHeader);
    if (user == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    categoryService.deletar(id);
    return ResponseEntity.noContent().build();
  }

  private User extrairUsuario(String authHeader) {
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      System.out.println("DEBUG: extrairUsuario - Header inválido ou ausente");
      return null;
    }
    String token = authHeader.substring(7);
    String email = jwtUtil.extrairEmail(token);
    return userRepository.findByEmail(email).orElse(null);
  }
}
