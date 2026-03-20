package com.system.system.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.system.system.model.Task;
import com.system.system.model.User;
import com.system.system.repository.TaskRepository;
import com.system.system.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskService {

  private final TaskRepository taskRepository;
  private final UserRepository userRepository;

  // CREATE
  public Task salvar(Task task) {
    if (task.getUser() != null && task.getUser().getId() != null) {
  
      User user = userRepository.findById(task.getUser().getId())
          .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

      task.setUser(user);
    }

    return taskRepository.save(task);
  }

  // READ ALL
  public List<Task> listarTodos() {
    return taskRepository.findAll();
  }

  // READ BY ID
  public Optional<Task> buscarPorId(Long id) {
    return taskRepository.findById(id);
  }

  // READ TASKS BY USER
  public List<Task> buscarPorUsuario(Long userId) {
    return taskRepository.findByUserId(userId);
  }

  // UPDATE
  public Task atualizar(Long id, Task dados) {

    Task task = taskRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Task não encontrada"));

    task.setTitle(dados.getTitle());
    task.setDescription(dados.getDescription());
    task.setDueDate(dados.getDueDate());
    task.setPriority(dados.getPriority());
    task.setCategory(dados.getCategory());
    task.setCompleted(dados.getCompleted());

    return taskRepository.save(task);
  }

  // DELETE
  public void deletar(Long id) {
    taskRepository.deleteById(id);
  }

  // COMPLETE TASK
  public Task marcarComoConcluida(Long id) {

    Task task = taskRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Task não encontrada"));

    if (!task.getCompleted()) {
      task.setCompleted(true);

      // Ganha +5 EXP ao concluir tarefa (apenas uma vez por tarefa)
      if (task.getExpRewarded() == null || !task.getExpRewarded()) {
        User user = task.getUser();
        if (user != null) {
          user.setTotalExp(user.getTotalExp() + 5);
          userRepository.save(user);
        }
        task.setExpRewarded(true);
      }
    }

    return taskRepository.save(task);
  }

}