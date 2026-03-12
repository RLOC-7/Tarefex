# Walkthrough: Sistema de Gamificação (EXP & Check-in)

Implementamos um sistema de recompensas para tornar a gestão de tarefas mais engajadora e produtiva.

## Recursos Implementados

### 🎮 Sistema de Nível
O usuário agora possui um nível calculado baseado no seu EXP total.
- **Lógica**: Cada 100 EXP = 1 Nível.
- **Progresso**: Uma barra de progresso premium foi adicionada à aba de Estatísticas.

### 🚀 Ganhando EXP
- **Tarefas**: Ao concluir qualquer tarefa, o usuário recebe automaticamente **+5 EXP**.
- **Check-in Diário**: Uma nova missão diária permite ganhar **+50 EXP** uma vez por dia.
- **Anti-Farming**: Cada tarefa concede XP apenas uma vez. Se você reabrir e concluir a mesma tarefa, não ganhará XP extra. Isso incentiva a criação de novas metas!

## Mudanças Técnicas

### Backend
- **Modelo de Usuário**: Novos campos `totalExp` e `lastCheckIn`.
- **API**: Endpoint `POST /api/user/checkin` para processar a recompensa diária.
- **Serviço de Tarefas**: Integração para conceder EXP no momento da conclusão.

### Frontend
- **Profile UI**: Nova aba de estatísticas com barra de nível "Master" e card de missão diária.
- **Header Evolutivo**: Nível, progresso de XP e nome agora visíveis no topo. Menu simplificado em dropdown para visual limpo.
- **TaskItem**: Tag visual **EXP+** identifica tarefas que já concederam recompensa.
- **Feedback**: Notificações Toast para avisar sobre o ganho de EXP.

## Como Testar
1. Vá até o seu **Perfil** e abra a aba **Estatísticas**.
2. Veja o seu nível inicial (Lvl 1).
3. Clique em **Realizar Check-in** para ganhar seus primeiros 50 EXP.
4. Conclua uma tarefa na sua lista e volte ao perfil para ver o progresso da barra!

---
*Gamificação ativa: Transformando dever em prazer!* 🏆
