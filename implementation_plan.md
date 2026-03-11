# Plano de Implementação: Alteração de Senha do Usuário

## Objetivo
Implementar a funcionalidade de alteração de senha na aba de Segurança do Perfil (`Profile.jsx`), garantindo que a nova senha seja atualizada de forma segura no banco de dados.

## Mudanças Propostas

### Backend

#### [NEW] [ChangePasswordDTO.java](file:///c:/Apps/tarefex/Backend/system/src/main/java/com/system/system/dto/ChangePasswordDTO.java)
- Criar um DTO (`currentPassword` e `newPassword`) para receber os dados.

#### [MODIFY] [UserService.java](file:///c:/Apps/tarefex/Backend/system/src/main/java/com/system/system/service/UserService.java)
- Método `alterarSenha`: verificar se a `senhaAtual` bate com a hash usando `BCrypt`.
- Hashear e salvar a `novaSenha`.

#### [MODIFY] [UserController.java](file:///c:/Apps/tarefex/Backend/system/src/main/java/com/system/system/controller/UserController.java)
- Endpoint `PUT /api/user/password` para realizar a alteração.

### Frontend

#### [MODIFY] [Profile.jsx](file:///c:/Apps/tarefex/src/pages/Profile.jsx)
- Estado `passwordData` (`currentPassword`, `newPassword`, `confirmPassword`).
- Formulário na aba "Segurança".
- Validar se `newPassword` === `confirmPassword`.
- Função `handlePasswordSubmit()` que faz o request PUT passando o DTO.

## Plano de Verificação

### Verificação
1. Mudar senha com senha atual errada -> Erro no backend.
2. Mudar senha com confirmação diferente -> Erro no frontend.
3. Mudar corretamente -> Sucesso, login deve funcionar com nova senha.
