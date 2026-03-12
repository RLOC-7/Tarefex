package com.system.system.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "tb_user")
@Getter
@Setter
public class User {

  @PrePersist
  @PreUpdate
  private void prepararDados() {
    if (this.name != null)
      this.name = this.name.toUpperCase().trim();
    if (this.lastname != null)
      this.lastname = this.lastname.toUpperCase().trim();
    if (this.razaoSocial != null)
      this.razaoSocial = this.razaoSocial.toUpperCase().trim();

    // Seta createdAt apenas se for uma nova persistência (id nulo)
    if (this.id == null && this.createdAt == null) {
      this.createdAt = LocalDate.now();
    }
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Column(name = "name", length = 255)
  private String name;

  @NotBlank
  @Column(name = "lastname", length = 255)
  @com.fasterxml.jackson.annotation.JsonProperty("lastName")
  private String lastname;

  @NotBlank
  @Column(name = "email", nullable = false, unique = true, length = 255)
  private String email;

  @JsonFormat(pattern = "yyyy-MM-dd")
  @Column(name = "birth", columnDefinition = "DATE")
  private LocalDate birth;

  @NotBlank
  @JsonIgnore
  @Size(min = 6)
  @Column(name = "password", nullable = false, length = 255)
  private String password;

  @Column(name = "cad_status", nullable = false)
  private Boolean cadStatus;

  @Column(name = "razao_social", length = 255)
  private String razaoSocial;

  @Column(name = "created_at", updatable = false)
  private LocalDate createdAt;

  @Column(name = "bio", length = 500)
  private String bio;

  @Column(name = "total_exp", nullable = false)
  private Long totalExp = 0L;

  @Column(name = "last_check_in")
  private LocalDate lastCheckIn;

}