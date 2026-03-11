package com.system.system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import com.system.system.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

  List<Task> findByUserId(Long userId);

}