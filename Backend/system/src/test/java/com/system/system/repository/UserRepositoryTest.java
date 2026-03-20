package com.system.system.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.system.system.model.User;

@DataJpaTest
class UserRepositoryTest {

  @Autowired
  private UserRepository userRepository;

  @Test
  void deveSalvarNomeEmMaiusculo() {
    User user = new User();
    user.setName("João");
    user.setLastname("Silva");
    user.setBirth(LocalDate.of(1997, 3, 13));
    user.setEmail("email@example.com");
    user.setPassword("senha123");
    user.setRazaoSocial("VASP");
    user.setCadStatus(true);

    User saved = userRepository.save(user);

    assertEquals("JOÃO", saved.getName());
    assertEquals("SILVA", saved.getLastname());
  }

  @Test
  void devePreencherCreatedAtAutomaticamente() {
    User user = new User();
    user.setName("Maria");
    user.setLastname("Souza");
    user.setEmail("maria@email.com");
    user.setPassword("123456");
    user.setCadStatus(true);
    user.setBirth(LocalDate.of(1997, 3, 13));

    User saved = userRepository.save(user);

    assertNotNull(saved.getCreatedAt());
  }

  @Test
  void naoDeveSalvarUsuarioSemEmail() {
    User user = new User();
    user.setName("Maria");
    user.setLastname("Souza");
    user.setEmail(null);
    user.setPassword("123456");
    user.setCadStatus(true);
    user.setBirth(LocalDate.of(1997, 3, 13));

    assertThrows(jakarta.validation.ConstraintViolationException.class, () -> {
      userRepository.saveAndFlush(user);
    });
  };

  @Test
  void naoDeveSalvarUsuarioSemNome() {
    User user = new User();
    user.setName(null);
    user.setLastname("Souza");
    user.setEmail("example@email.com");
    user.setPassword("123456");
    user.setCadStatus(true);
    user.setBirth(LocalDate.of(1997, 3, 13));

    assertThrows(jakarta.validation.ConstraintViolationException.class, () -> {
      userRepository.saveAndFlush(user);
    });
  };

  @Test
  void naoDeveSalvarUsuarioSemRazaoSocial() {
    User user = new User();
    user.setName("Maria");
    user.setLastname("Souza");
    user.setEmail("example@email.com");
    user.setPassword("123456");
    user.setCadStatus(true);
    user.setRazaoSocial(null);
    user.setBirth(LocalDate.of(1997, 3, 13));

    assertThrows(jakarta.validation.ConstraintViolationException.class, () -> {
      userRepository.saveAndFlush(user);
    });
  };

  @Test
  void naoDevePermitirEmailDuplicado() {
    User user1 = new User();
    user1.setName("Maria");
    user1.setLastname("Souza");
    user1.setEmail("email@example.com");
    user1.setPassword("123456");
    user1.setCadStatus(true);
    user1.setBirth(LocalDate.of(1997, 3, 13));
    userRepository.saveAndFlush(user1);

    User user2 = new User();
    user2.setName("João");
    user2.setLastname("Silva");
    user2.setBirth(LocalDate.of(1997, 3, 13));
    user2.setEmail("email@example.com");
    user2.setPassword("senha123");
    user2.setRazaoSocial("VASP");
    user2.setCadStatus(true);

    assertThrows(org.springframework.dao.DataIntegrityViolationException.class, () -> {
      userRepository.saveAndFlush(user2);
    });
  }
}