package com.system.system.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.system.system.model.Task;
import com.system.system.model.User;
import com.system.system.repository.TaskRepository;
import com.system.system.repository.UserRepository;

@DataJpaTest
public class TaskRepositoryTest {

  @Autowired
  private TaskRepository taskRepository;

  @Autowired
  private UserRepository userRepository;
  private User user;

  @BeforeEach
  void setUp() {
    user = new User();
    user.setName("Maria");
    user.setLastname("Souza");
    user.setEmail("maria@email.com");
    user.setPassword("123456");
    user.setCadStatus(true);
    user.setBirth(LocalDate.of(1997, 3, 13));

    user = userRepository.save(user);

  }

  @Test
  void testeCriartarefaSucesso() {

    Task task = new Task();
    task.setTitle("Tarefa 1");
    task.setDescription("Descrição da tarefa 1");
    task.setCompleted(false);
    task.setDueDate(LocalDate.of(2024, 6, 30));
    task.setPriority("Alta");
    task.setCategory("Trabalho");
    task.setUpdatedAt(LocalDate.now().atStartOfDay());
    task.setExpRewarded(true);

    task.setUser(user);

    Task saved = taskRepository.save(task);
    assertNotNull(saved.getId());
  }

  @Test
  void testeCriartarefaFalhou() {

    Task task = new Task();
    task.setTitle(null);
    task.setDescription("Descrição da tarefa 1");
    task.setCompleted(false);
    task.setDueDate(LocalDate.of(2024, 6, 30));
    task.setPriority("Alta");
    task.setCategory("Trabalho");
    task.setUpdatedAt(LocalDate.now().atStartOfDay());
    task.setExpRewarded(true);

    task.setUser(user);

    assertThrows(Exception.class, () -> {
      taskRepository.saveAndFlush(task);
    });
  }

}
