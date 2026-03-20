package com.system.system.service;

import com.system.system.model.Category;
import com.system.system.model.User;
import com.system.system.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

  @Autowired
  private CategoryRepository categoryRepository;

  public List<Category> listarPorUsuario(User user) {
    return categoryRepository.findByUser(user);
  }

  public Category salvar(Category category) {
    if (category == null) {
      throw new IllegalArgumentException("ID do usuário não pode ser nulo");
    }
    return categoryRepository.save(category);
  }

  public void deletar(Long id) {
    if (id == null) {
      throw new IllegalArgumentException("ID do usuário não pode ser nulo");
    }
    categoryRepository.deleteById(id);
  }

  public java.util.Optional<Category> buscarPorId(Long id) {
    if (id == null) {
      throw new IllegalArgumentException("ID do usuário não pode ser nulo");
    }
    return categoryRepository.findById(id);
  }
}
