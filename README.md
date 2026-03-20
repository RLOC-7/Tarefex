# 🚀 Tarefex - Task Management System

**Tarefex** é uma plataforma robusta e moderna para gerenciamento de tarefas, projetada para oferecer uma experiência de usuário premium com foco em produtividade, segurança e visual state-of-the-art. 

Este projeto foi construído utilizando uma arquitetura desacoplada com um **Backend robusto em Java (Spring Boot)** e um **Frontend dinâmico em React**.

---

## ✨ Principais Funcionalidades

- 🔐 **Autenticação Segura**: Sistema completo de Login e Registro utilizando **JWT (JSON Web Tokens)** e criptografia **BCrypt**.
- 📊 **Dashboard Interativo**: Visualização de dados em tempo real com estatísticas de tarefas, produtividade e gráficos de pizza/barras (**Recharts**).
- 📁 **Gestão de Categorias**: Criação, edição e personalização de categorias com cores e emojis dinâmicos.
- ✅ **Gestão de Tarefas (CRUD)**: Fluxo completo de criação, edição, conclusão e filtragem avançada de tarefas.
- 👤 **Perfil Personalizado**: Edição de dados do usuário, biografia, fuso horário e troca de senha segura.
- 🔔 **Notificações Modernas**: Sistema de Toasts customizado com **Glassmorphism**, animações e feedback em tempo real.
- 🌓 **Interface Premium**: Design dark mode elegante com efeitos de vidro, sombras suaves e micro-animações.

---

## 🛠️ Tecnologias Utilizadas

### **Backend**
- **Java 21** & **Spring Boot 3**
- **Spring Security** & **JWT**
- **Spring Data JPA** (Hibernate)
- **MySQL** (Persistência de dados)
- **Lombok** (Melhoria de produtividade)
- **Swagger** (Documentação da API)

### **Frontend**
- **React.js** (Vite)
- **Vanilla CSS** (Design Customizado e Premium)
- **Recharts** (Visualização de Dados)
- **Lucide React** (Ícones)
- **Fetch API** (Comunicação com o Backend)

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- JDK 17 ou superior
- Node.js & npm
- MySQL Server

### 1. Clonar o Repositório
```bash
git clone https://github.com/RLOC-7/Tarefex.git
cd Tarefex
```

### 2. Configurar o Backend
1. Navegue até a pasta do backend:
   ```bash
   cd Backend/system
   ```
2. Configure o banco de dados no arquivo `src/main/resources/application.properties` (URL, usuário e senha).
3. Execute projeto:
   ```bash
   ./mvnw spring-boot:run
   ```

### 3. Configurar o Frontend
1. Navegue até a pasta do frontend:
   ```bash
   cd Frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Consulta ao Swagger
  [Swagger](http://localhost:8080/swagger-ui.html)
---

## 📐 Arquitetura do Projeto

A estrutura do projeto está organizada da seguinte forma:

```text
tarefex/
├── Backend/system/  # API Spring Boot (Java)
└── Frontend/        # Aplicação React (Vite)
    ├── src/         # Componentes, Páginas e Lógica
    └── public/      # Assets estáticos
```

O projeto segue as melhores práticas de desenvolvimento, incluindo:
- **Separação de Preocupações**: Camadas bem definidas no Backend (Controller, Service, Repository, DTO, Model).
- **Segurança**: Proteção de rotas via middleware JWT no Backend e interceptadores no Frontend.
- **DIP (Dependency Inversion Principle)**: Uso extensivo de Injeção de Dependências com Spring.
- **UX First**: Interface intuitiva focada em reduzir a carga cognitiva do usuário.

---

## 👨‍💻 Autor

Este projeto foi desenvolvido como uma demonstração de habilidades fullstack, unindo a robustez do ecossistema Java com a agilidade do ecossistema React.

---
*Developed by **RLOC-7***