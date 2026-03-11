package com.system.system.service;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.system.system.config.JwtUtil;
import com.system.system.dto.LoginRequestDTO;
import com.system.system.dto.LoginResponseDTO;
import com.system.system.dto.UserRequestDTO;
import com.system.system.dto.UserResponseDTO;
import com.system.system.model.User;
import com.system.system.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

  private final UserRepository repository;
  private final JwtUtil jwtUtil;
  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  public UserService(UserRepository repository, JwtUtil jwtUtil) {
    this.repository = repository;
    this.jwtUtil = jwtUtil;
  }

  // ===== REGRAS DE NEGOCIO =====
  public User salvarNovoUsuario(UserRequestDTO dto) {
    User usuario = new User();
    usuario.setName(dto.name());
    usuario.setLastname(dto.lastname());
    usuario.setEmail(dto.email());
    usuario.setPassword(passwordEncoder.encode(dto.password()));
    usuario.setCadStatus(dto.cadStatus());
    usuario.setRazaoSocial(dto.razaoSocial());
    usuario.setBirth(dto.birth());
    usuario.setBio(dto.bio());

    if (usuario.getName() == null || usuario.getName().isEmpty()) {
      throw new IllegalArgumentException("Nome é obrigatório!");
    }
    if (usuario.getLastname() == null || usuario.getLastname().isEmpty()) {
      throw new IllegalArgumentException("Sobrenome é obrigatório!");
    }
    if (usuario.getCadStatus() == null) {
      usuario.setCadStatus(true);
    }

    return repository.save(usuario);
  }

  public List<User> salvarMuitos(List<User> lista) {
    lista.forEach(u -> {
      if (u.getCadStatus() == null)
        u.setCadStatus(true);
    });
    return repository.saveAll(lista);
  }

  // ===== AUTENTICAÇÃO =====

  public LoginResponseDTO login(LoginRequestDTO dto) {
    Optional<User> userOpt = repository.findByEmail(dto.getEmail());

    if (userOpt.isEmpty()) {
      throw new RuntimeException("Usuário não encontrado");
    }

    User user = userOpt.get();

    if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
      throw new RuntimeException("Senha incorreta");
    }

    // Gera JWT real com o email como subject
    String token = jwtUtil.gerarToken(user.getEmail());

    return new LoginResponseDTO(user, token);
  }

  /** Busca o usuário pelo email extraído do token JWT */
  public User buscarUsuarioPorToken(String token) {
    if (!jwtUtil.validarToken(token)) {
      return null;
    }
    String email = jwtUtil.extrairEmail(token);
    return repository.findByEmail(email).orElse(null);
  }

  /** Atualiza o perfil do usuário logado identificado pelo token */
  public UserResponseDTO atualizarPorToken(String token, UserRequestDTO dto) {
    User user = buscarUsuarioPorToken(token);
    if (user == null) {
      throw new RuntimeException("Usuário não autenticado ou não encontrado");
    }

    // Atualiza apenas os campos permitidos
    if (dto.name() != null)
      user.setName(dto.name());
    if (dto.lastname() != null)
      user.setLastname(dto.lastname());
    if (dto.birth() != null)
      user.setBirth(dto.birth());
    if (dto.bio() != null)
      user.setBio(dto.bio());
    if (dto.razaoSocial() != null)
      user.setRazaoSocial(dto.razaoSocial());

    User saved = repository.save(user);

    return new UserResponseDTO(
        saved.getId(),
        saved.getName(),
        saved.getLastname(),
        saved.getEmail(),
        saved.getRazaoSocial(),
        saved.getCreatedAt(),
        saved.getBio());
  }

  /** Altera a senha do usuário logado validando a senha atual */
  public void alterarSenha(String token, String currentPassword, String newPassword) {
    User user = buscarUsuarioPorToken(token);
    if (user == null) {
      throw new RuntimeException("Usuário não autenticado ou não encontrado");
    }

    // Valida se a senha atual fornecida bate com a hash no banco de dados
    if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
      throw new RuntimeException("A senha atual está incorreta.");
    }

    // Hasheia e salva a nova senha
    user.setPassword(passwordEncoder.encode(newPassword));
    repository.save(user);
  }

  // ===== OPERAÇÕES DE BANCO =====

  public Optional<User> buscarPorId(Long id) {
    return repository.findById(id);
  }

  public List<User> listarTodos() {
    return repository.findAll();
  }

  public User atualizar(Long id, User dados) {
    return repository.findById(id).map(reg -> {
      reg.setName(dados.getName());
      reg.setLastname(dados.getLastname());
      reg.setBirth(dados.getBirth());
      reg.setCadStatus(dados.getCadStatus());
      reg.setRazaoSocial(dados.getRazaoSocial());
      reg.setBio(dados.getBio());
      return repository.save(reg);
    }).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
  }

  public void deletar(Long id) {
    repository.deleteById(id);
  }
}
