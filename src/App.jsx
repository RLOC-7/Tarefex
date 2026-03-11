import { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/SideBar";
import TaskManager from "./components/TaskManager";
import TaskModal from "./components/TaskModal";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Settings from "./components/Settings";
import CategoryModal from "./components/CategoryModal";
import { ToastContainer } from "./components/Toast";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("tarefex-login") === "true";
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    status: "all",
    categories: [],
    priorities: []
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([
    { value: "work", label: "Trabalho", color: "#EF4444" },
    { value: "studies", label: "Estudos", color: "#3B82F6" },
    { value: "health", label: "Saúde", color: "#10B981" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [authScreen, setAuthScreen] = useState("login");
  const [currentPage, setCurrentPage] = useState("tasks"); // 🔹 Controla a página atual
  const [toasts, setToasts] = useState([]);

  // ==============================
  // 0. GERENCIADOR DE TOASTS
  // ==============================
  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // ==============================
  // 1. CARREGAR DADOS DO LOCALSTORAGE
  // ==============================
  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          // Carregar Tarefas
          const taskRes = await fetch("http://localhost:8080/api/tasks", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (taskRes.ok) setTasks(await taskRes.json());

          // Carregar Categorias
          const catRes = await fetch("http://localhost:8080/api/categories", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (catRes.ok) {
            const serverCategories = await catRes.json();
            setCategories((prev) => {
              // Categorias padrão que SEMPRE devem existir
              const defaults = [
                { value: "work", label: "Trabalho", color: "#EF4444", icon: "💼" },
                { value: "studies", label: "Estudos", color: "#3B82F6", icon: "📚" },
                { value: "health", label: "Saúde", color: "#10B981", icon: "🏥" },
              ];
              // Combina padrões com as do servidor
              const combined = [...defaults, ...serverCategories];
              // Remove duplicatas baseadas no 'value'
              const unique = combined.filter((cat, index, self) =>
                cat && cat.value && index === self.findIndex((c) => c?.value === cat.value)
              );
              return unique;
            });
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isLoggedIn]);

  // ==============================
  // 2. SALVAR TAREFAS E CATEGORIAS
  // ==============================
  useEffect(() => {
    localStorage.setItem("tarefex-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("tarefex-categories", JSON.stringify(categories));
  }, [categories]);

  // ==============================
  // 3. AUTENTICAÇÃO
  // ==============================
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("tarefex-login", "true");
  };

  const handleRegister = () => {
    setIsLoggedIn(true);
    localStorage.setItem("tarefex-login", "true");
  };

  const goToRegister = () => setAuthScreen("register");

  const goToLogin = () => setAuthScreen("login");

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      setIsLoggedIn(false);
      localStorage.removeItem("tarefex-login");
      setCurrentPage("tasks");
    }
  };

  // ==============================
  // 4. CALLBACKS DE NAVEGAÇÃO
  // ==============================

  const handleProfile = () => setCurrentPage("profile");
  const handleTasks = () => setCurrentPage("tasks");
  const handleDashboard = () => setCurrentPage("dashboard");
  const handleSettings = () => setCurrentPage("settings");

  // ==============================
  // 5. MODAL DE TAREFAS
  // ==============================
  const openModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const openCategoryModal = (category = null) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(false);
  };

  // ==============================
  // 6. CRUD DE TAREFAS
  // ==============================
  const addTask = async (newTask) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Sessão expirada. Faça login novamente.");
        setIsLoggedIn(false);
        return;
      }

      const response = await fetch("http://localhost:8080/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });

      if (response.status === 403) {
        alert("Erro 403: Acesso negado. Tente fazer logout e login novamente.");
        return;
      }

      if (response.ok) {
        const savedTask = await response.json();
        setTasks((prev) => [...prev, savedTask]);
        showToast("Tarefa criada com sucesso!", "success");
        closeModal();
      } else {
        showToast("Erro ao criar tarefa.", "error");
      }
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      showToast("Erro de conexão.", "error");
    }
  };

  const editTask = async (updatedTask) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/tasks/${updatedTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        const savedTask = await response.json();
        setTasks((prev) =>
          prev.map((task) => (task.id === savedTask.id ? savedTask : task))
        );
        showToast("Tarefa atualizada!", "success");
        closeModal();
      } else {
        showToast("Erro ao atualizar tarefa.", "error");
      }
    } catch (error) {
      console.error("Erro ao editar tarefa:", error);
      showToast("Erro de conexão.", "error");
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/tasks/${taskId}/complete`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? updatedTask : task))
        );
        showToast(updatedTask.completed ? "Tarefa concluída! 🎉" : "Tarefa reaberta.", "info");
      }
    } catch (error) {
      console.error("Erro ao alternar conclusão:", error);
    }
  };

  const deleteTask = async (taskId) => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setTasks((prev) => prev.filter((task) => task.id !== taskId));
          showToast("Tarefa excluída com sucesso.", "info");
        } else {
          showToast("Erro ao excluir tarefa.", "error");
        }
      } catch (error) {
        console.error("Erro ao excluir tarefa:", error);
        showToast("Erro de conexão.", "error");
      }
    }
  };

  const clearCompletedTasks = () => {
    const completedCount = tasks.filter((t) => t.completed).length;
    if (completedCount === 0) {
      showToast("Não há tarefas concluídas para limpar.", "info");
      return;
    }
    if (
      window.confirm(
        `Tem certeza que deseja limpar ${completedCount} tarefa(s) concluída(s)?`
      )
    ) {
      setTasks((prev) => prev.filter((t) => !t.completed));
      showToast("Lista limpa com sucesso!", "success");
    }
  };

  // ==============================
  // 7. GERENCIAMENTO DE CATEGORIAS
  // ==============================
  const addCategory = async (newCat) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const categoryLabel = (newCat.name || newCat.label || "").trim();
    if (!categoryLabel) return;

    const categoryData = {
      label: categoryLabel,
      value: categoryLabel.toLowerCase().replace(/\s+/g, "-"),
      color: newCat.color || `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`,
      icon: newCat.icon || "📁"
    };

    try {
      const response = await fetch("http://localhost:8080/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        const savedCategory = await response.json();
        setCategories((prev) => {
          // Evita duplicatas ao adicionar no estado
          if (prev.some(c => c.value === savedCategory.value)) return prev;
          return [...prev, savedCategory];
        });
        showToast("Categoria criada!", "success");
      } else {
        const errorData = await response.text();
        console.error("Erro do servidor ao salvar categoria:", errorData);
        showToast("Erro ao criar categoria.", "error");
      }
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      showToast("Erro de conexão.", "error");
    }
  };

  const updateCategory = async (catToUpdate) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8080/api/categories/${catToUpdate.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(catToUpdate),
      });

      if (response.ok) {
        const updatedCategory = await response.json();
        setCategories((prev) =>
          prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c))
        );
        showToast("Categoria atualizada!", "success");
      } else {
        showToast("Erro ao atualizar categoria.", "error");
      }
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      showToast("Erro de conexão.", "error");
    }
  };

  // ==============================
  // 8. FILTRAGEM DE TAREFAS
  // ==============================
  const filteredTasks = tasks.filter((task) => {
    // 1. Filtro de busca (por título)
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Filtro de Status
    let matchesStatus = true;
    if (filters.status === "active") {
      matchesStatus = !task.completed;
    } else if (filters.status === "completed") {
      matchesStatus = task.completed;
    }

    // 3. Filtro de Categorias (Múltiplo)
    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(task.category);

    // 4. Filtro de Prioridades (Múltiplo)
    const matchesPriority = filters.priorities.length === 0 || filters.priorities.includes(task.priority);

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  // ==============================
  // 9. ESTATÍSTICAS
  // ==============================
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed
  ).length;

  // ==============================
  // 9. LOADING SCREEN
  // ==============================
  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );

  // ==============================
  // 10. LOGIN / REGISTER
  // ==============================
  const authContent = authScreen === "login" ? (
    <Login onLogin={handleLogin} onGoRegister={goToRegister} showToast={showToast} />
  ) : (
    <Register onRegister={handleRegister} onGoLogin={goToLogin} showToast={showToast} />
  );

  if (!isLoggedIn) {
    return (
      <>
        {authContent}
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </>
    );
  }

  // ==============================
  // 11. INTERFACE PRINCIPAL
  // ==============================
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header
        onLogout={handleLogout}
        onProfile={handleProfile}
        onTasks={handleTasks}
        onDashboard={handleDashboard}
        onSettings={handleSettings}
      />

      <main className="container mx-auto px-4 py-6">
        {currentPage === "tasks" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="lg:col-span-1">
              <Sidebar
                tasks={tasks}
                filters={filters}
                onFilterChange={setFilters}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onClearCompleted={clearCompletedTasks}
                categories={categories}
                onAddCategory={() => openCategoryModal(null)}
                onEditCategory={openCategoryModal}
              />
            </aside>
            <section className="lg:col-span-3">
              <TaskManager
                tasks={filteredTasks} // 🔹 Passa as tarefas filtradas
                totalTasks={totalTasks}
                completedTasks={completedTasks}
                pendingTasks={pendingTasks}
                overdueTasks={overdueTasks}
                onAddTask={() => openModal(null)}
                onEditTask={openModal}
                onToggleCompletion={toggleTaskCompletion}
                onDeleteTask={deleteTask}
                categories={categories}
                onAddCategory={addCategory}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </section>
          </div>
        )}

        {currentPage === "dashboard" && (
          <Dashboard
            onNavigateToTasks={handleTasks}
            onNavigateToProfile={handleProfile}
            onNavigateToSettings={() => setCurrentPage("settings")} // 🔹 Crie esta função se necessário
            tasks={tasks} // 🔹 Passe as tarefas reais
            categories={categories} // 🔹 Passa as categorias para mapear labels
          />
        )}

        {currentPage === "settings" && (
          <Settings onNavigateToTasks={handleTasks} />
        )}

        {currentPage === "profile" && (
          <Profile
            onNavigateToTasks={handleTasks}
            onLogout={handleLogout}
            showToast={showToast}
          />
        )}
      </main>

      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {isModalOpen && (
        <TaskModal
          onClose={closeModal}
          onSave={editingTask ? editTask : addTask}
          task={editingTask}
          isEditing={!!editingTask}
          categories={categories}
          onAddCategory={addCategory}
        />
      )}

      {isCategoryModalOpen && (
        <CategoryModal
          onClose={closeCategoryModal}
          onSave={editingCategory ? updateCategory : addCategory}
          category={editingCategory}
          isEditing={!!editingCategory}
        />
      )}

      <footer className="bg-gray-800 border-t border-gray-700 mt-12 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 mb-2">
            &copy; 2024 Tarefex - Sistema de Gerenciamento de Tarefas
          </p>
          <p className="text-green-400 font-medium">
            Desenvolvido por Black Enterprise
          </p>
          {totalTasks > 0 && (
            <div className="mt-2 text-sm text-gray-500">
              <span>{totalTasks} tarefas</span>
              <span className="mx-2">•</span>
              <span>{completedTasks} concluídas</span>
              <span className="mx-2">•</span>
              <span>{pendingTasks} pendentes</span>
              {overdueTasks > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <span className="text-red-400">{overdueTasks} atrasadas</span>
                </>
              )}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

export default App;
