package com.system.system.dto;

import com.system.system.model.User;

public class LoginResponseDTO {
  private User user;
  private String token; // caso queira JWT ou algum token simples

  public LoginResponseDTO(User user, String token) {
    this.user = user;
    this.token = token;
  }

  public User getUser() {
    return user;
  }

  public String getToken() {
    return token;
  }
}