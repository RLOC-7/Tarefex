import { useState, useEffect } from "react";

const Profile = ({ onNavigateToTasks, onLogout, showToast }) => {
  const [userData, setUserData] = useState({
    name: "",
    lastname: "",
    email: "",
    razaoSocial: "",
    avatar: "",
    bio: "",
    theme: "dark",
    notifications: true,
    language: "pt-BR",
    autoSave: true,
    timeFormat: "24h",
    totalExp: 0,
    lastCheckIn: null
  });
  const [joinDate, setJoinDate] = useState(null);
  const [sessionInfo, setSessionInfo] = useState({
    ip: "Carregando...",
    device: "Detectando...",
    browser: "Navegador",
    os: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    productivity: 0,
    streak: 7,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Carregar dados do usuário e estatísticas
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // 1. Popula imediatamente com os dados do usuário logado (salvo no login)
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserData((prev) => ({
          ...prev,
          name: parsedUser.name || prev.name,
          lastname: parsedUser.lastname || prev.lastname,
          razaoSocial: parsedUser.razaoSocial || prev.razaoSocial,
          email: parsedUser.email || prev.email,
          avatar: parsedUser.avatar || prev.avatar,
          bio: parsedUser.bio || prev.bio,
          theme: parsedUser.theme || prev.theme,
          notifications: parsedUser.notifications ?? prev.notifications,
          language: parsedUser.language || prev.language,
          autoSave: parsedUser.autoSave ?? prev.autoSave,
          timeFormat: parsedUser.timeFormat || prev.timeFormat,
        }));
        if (parsedUser.createdAt) setJoinDate(parsedUser.createdAt);
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("Usuário não autenticado");
          setIsLoading(false);
          return;
        }

        // 2. Busca dados atualizados do usuário autenticado na API
        const response = await fetch("http://192.168.1.4:8080/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData({
            name: data.name,
            lastname: data.lastname,
            razaoSocial: data.razaoSocial,
            email: data.email,
            avatar: data.avatar || "",
            bio: data.bio || "",
            theme: data.theme || "dark",
            notifications: data.notifications ?? true,
            language: data.language || "pt-BR",
            autoSave: data.autoSave ?? true,
            timeFormat: data.timeFormat || "24h",
            totalExp: data.totalExp || 0,
            lastCheckIn: data.lastCheckIn || null,
          });
          // createdAt vem da API como ISO string
          if (data.createdAt) setJoinDate(data.createdAt);
        }

        // 3. Carrega tarefas do usuário autenticado (token identifica o usuário)
        const tasksResponse = await fetch("http://192.168.1.4:8080/api/tasks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const tasks = tasksResponse.ok ? await tasksResponse.json() : [];
        const completed = tasks.filter((t) => t.completed).length;

        setStats({
          totalTasks: tasks.length,
          completedTasks: completed,
          pendingTasks: tasks.length - completed,
          productivity: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
          streak: Math.floor(Math.random() * 30) + 1,
        });
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Detecção de Sessão
    const getSessionDetails = async () => {
      try {
        const ua = navigator.userAgent;
        
        // Browser
        let browser = "Navegador";
        if (ua.indexOf("Firefox") > -1) browser = "Firefox";
        else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera";
        else if (ua.indexOf("Edg") > -1) browser = "Edge";
        else if (ua.indexOf("Chrome") > -1) browser = "Chrome";
        else if (ua.indexOf("Safari") > -1) browser = "Safari";

        // OS
        let os = "";
        if (ua.indexOf("Win") !== -1) os = "Windows";
        else if (ua.indexOf("Mac") !== -1) os = "MacOS";
        else if (ua.indexOf("Linux") !== -1) os = "Linux";
        else if (ua.indexOf("Android") !== -1) os = "Android";
        else if (ua.indexOf("like Mac") !== -1) os = "iOS";

        // Device
        let device = "Desktop";
        if (/Mobi|Android/i.test(ua)) device = "Celular";
        if (/Tablet|iPad/i.test(ua)) device = "Tablet";

        // IP (Serviço externo leve)
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = ipRes.ok ? await ipRes.json() : { ip: "Local/Privado" };

        setSessionInfo({ ip: ipData.ip, device, browser, os });
      } catch (error) {
        console.error("Erro ao detectar sessão:", error);
      }
    };
    getSessionDetails();
  }, []);

  if (isLoading) return <div>Carregando perfil...</div>;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Sessão expirada. Faça login novamente.");
        return;
      }

      const response = await fetch("http://192.168.1.4:8080/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const updatedUser = await response.json();

        // Atualiza localStorage e estado
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUserData((prev) => ({
          ...prev,
          ...updatedUser,
        }));

        setIsEditing(false);
        showToast("Perfil atualizado com sucesso!", "success");
      } else {
        const errorData = await response.json().catch(() => ({}));
        showToast(errorData.message || "Erro ao salvar alterações.", "error");
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      showToast("Erro de conexão com o servidor.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    const savedUserData = localStorage.getItem("user");
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
    setIsEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserData((prev) => ({
          ...prev,
          avatar: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportData = () => {
    const tasks = JSON.parse(localStorage.getItem("tarefex-tasks") || "[]");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const data = {
      exportedAt: new Date().toISOString(),
      version: "1.0.0",
      user,
      tasks,
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.completed).length,
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = `tarefex-backup-${new Date().toISOString().split("T")[0]
      }.json`;
    link.click();
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);

          if (data.tasks) {
            localStorage.setItem("tarefex-tasks", JSON.stringify(data.tasks));
          }

          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
            setUserData(data.user);
          }

          showToast("Dados importados com sucesso! A página será recarregada.", "success");
          setTimeout(() => window.location.reload(), 1500);
        } catch {
          showToast("Erro ao importar dados. Verifique se o arquivo é válido.", "error");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearData = () => {
    if (
      window.confirm(
        "⚠️ ATENÇÃO: Isso irá apagar TODAS as suas tarefas. Tem certeza?"
      )
    ) {
      if (
        window.confirm(
          "⚠️ CONFIRMAÇÃO FINAL: Esta ação não pode ser desfeita. Continuar?"
        )
      ) {
        localStorage.removeItem("tarefex-tasks");
        showToast("Dados limpos com sucesso! A página será recarregada.", "success");
        setTimeout(() => window.location.reload(), 1500);
      }
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: "", text: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: "error", text: "A nova senha e a confirmação não coincidem." });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "A nova senha deve ter pelo menos 6 caracteres." });
      return;
    }

    setIsChangingPassword(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Sessão expirada. Faça login novamente.");
        return;
      }

      const response = await fetch("http://192.168.1.4:8080/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      if (response.ok) {
        setPasswordMessage({ type: "success", text: "Senha alterada com sucesso!" });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        const errorText = await response.text();
        setPasswordMessage({ type: "error", text: errorText || "Erro ao alterar a senha." });
      }
    } catch (error) {
      setPasswordMessage({ type: "error", text: "Erro de conexão com o servidor." });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCheckIn = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://192.168.1.4:8080/api/user/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData((prev) => ({
          ...prev,
          totalExp: data.totalExp,
          lastCheckIn: data.lastCheckIn,
        }));
        showToast("Check-in realizado! +50 EXP 🚀", "success");
      } else {
        const errorText = await response.text();
        showToast(errorText || "Erro ao realizar check-in.", "warning");
      }
    } catch (error) {
      showToast("Erro de conexão.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateLevel = (exp) => {
    const level = Math.floor(exp / 100) + 1;
    const currentLevelExp = exp % 100;
    const progress = (currentLevelExp / 100) * 100;
    return { level, currentLevelExp, progress };
  };

  const { level, currentLevelExp, progress } = calculateLevel(userData.totalExp);
  const isCheckedInToday = userData.lastCheckIn === new Date().toISOString().split('T')[0];

  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-400">
            👤 Perfil do Usuário
          </h1>
          <p className="text-gray-300">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar de Navegação */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              {/* Avatar e Informações Básicas */}
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mx-auto overflow-hidden border-4 border-green-500">
                    {userData.avatar ? (
                      <img
                        src={userData.avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">👤</span>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full cursor-pointer hover:bg-green-700 transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <h2 className="text-xl font-semibold mb-1">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    `${userData.name} ${userData.lastname}`
                  )}
                </h2>
                <p className="text-gray-400 text-sm">{userData.email}</p>
                {joinDate && (
                  <p className="text-gray-500 text-xs mt-2">
                    📅 Membro desde {formatJoinDate(joinDate)}
                  </p>
                )}
              </div>

              {/* Navegação */}
              <nav className="space-y-2 mb-6">
                {[
                  { id: "profile", label: " Perfil", icon: "👤" },
                  { id: "stats", label: " Estatísticas", icon: "📊" },
                  { id: "preferences", label: " Preferências", icon: "⚙️" },
                  { id: "security", label: " Segurança", icon: "🔒" },
                  { id: "data", label: " Dados", icon: "💾" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${activeTab === tab.id
                      ? "bg-green-600 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                      }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Botão Voltar */}
              <button
                onClick={onNavigateToTasks}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
              >
                ← Voltar para Tarefas
              </button>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              {/* Header do Conteúdo */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-green-400">
                  {activeTab === "profile" && "📊 Informações do Perfil"}
                  {activeTab === "stats" && "📈 Estatísticas e Métricas"}
                  {activeTab === "preferences" && "⚙️ Preferências"}
                  {activeTab === "security" && "🔒 Configurações de Segurança"}
                  {activeTab === "data" && "💾 Gerenciamento de Dados"}
                </h2>

                {activeTab === "profile" && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2"
                  >
                    <span>✏️</span>
                    <span>Editar Perfil</span>
                  </button>
                )}
              </div>

              {/* Conteúdo da Aba Selecionada */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nome
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={userData.name}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Ex: João"
                          required
                        />
                      ) : (
                        <p className="text-white text-lg">{userData.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Sobrenome
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastname"
                          value={userData.lastname}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Ex: Silva"
                        />
                      ) : (
                        <p className="text-white text-lg">{userData.lastname}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={userData.email}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="seu@email.com"
                        />
                      ) : (
                        <p className="text-white text-lg">{userData.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={userData.bio}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                        placeholder="Conte um pouco sobre você..."
                      />
                    ) : (
                      <p className="text-white">
                        {userData.bio || "Nenhuma bio adicionada."}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Empresa
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="razaoSocial"
                        value={userData.razaoSocial}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Razão Social"
                      />
                    ) : (
                      <p className="text-white">
                        {userData.razaoSocial || "Nenhuma razão social adicionada."}
                      </p>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex space-x-4 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-6 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Salvando...</span>
                          </>
                        ) : (
                          <>
                            <span>💾</span>
                            <span>Salvar Alterações</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                      >
                        ❌ Cancelar
                      </button>
                    </div>
                  )}
                </div>
              )}

               {activeTab === "stats" && (
                <div className="space-y-6">
                  {/* Barra de Nível Premium */}
                  <div className="bg-gray-700/50 p-6 rounded-2xl border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="text-green-400 text-sm font-bold uppercase tracking-wider">Nível Atual</p>
                        <h3 className="text-4xl font-black text-white flex items-center gap-2">
                          Lvl {level} <span className="text-xl font-normal text-gray-400">/ Master</span>
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-xs mb-1">XP Total: {userData.totalExp}</p>
                        <p className="text-white font-mono">{currentLevelExp} <span className="text-gray-500">/ 100 XP</span></p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-4 p-1 border border-gray-600 shadow-inner">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-1000 ease-out relative overflow-hidden"
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                    <p className="text-center text-xs text-gray-500 mt-2 italic">
                      Conclua tarefas para ganhar +5 XP cada!
                    </p>
                  </div>

                  {/* Grid de Estatísticas */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-700 p-4 rounded-xl border border-gray-600 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-green-400">
                        {stats.totalTasks}
                      </div>
                      <div className="text-xs text-gray-400">Total</div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-xl border border-gray-600 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {stats.completedTasks}
                      </div>
                      <div className="text-xs text-gray-400">Concluídas</div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-xl border border-gray-600 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {stats.pendingTasks}
                      </div>
                      <div className="text-xs text-gray-400">Pendentes</div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-xl border border-gray-600 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {stats.productivity}%
                      </div>
                      <div className="text-xs text-gray-400">Produtividade</div>
                    </div>
                  </div>

                  {/* Daily Mission / Check-in */}
                  <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-6 rounded-2xl border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-3xl border border-blue-500/20">
                        📅
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white">Missão Diária</h4>
                        <p className="text-sm text-gray-400">Faça check-in diário para ganhar bônus de XP!</p>
                      </div>
                    </div>
                    <button
                      onClick={handleCheckIn}
                      disabled={isCheckedInToday || isLoading}
                      className={`px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 ${isCheckedInToday
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                        }`}
                    >
                      {isCheckedInToday ? (
                        <>✅ Concluído</>
                      ) : (
                        <>🎁 Realizar Check-in (+50 XP)</>
                      )}
                    </button>
                  </div>

                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      📈 Progresso Semanal
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Meta semanal: 20 tarefas</span>
                        <span className="text-green-400">
                          {stats.completedTasks}/20
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              (stats.completedTasks / 20) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "preferences" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tema da Interface
                      </label>
                      <select
                        name="theme"
                        value={userData.theme}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="dark">🌙 Escuro</option>
                        <option value="light">☀️ Claro</option>
                        <option value="auto">🔄 Automático</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Idioma
                      </label>
                      <select
                        name="language"
                        value={userData.language}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="pt-BR">🇧🇷 Português (BR)</option>
                        <option value="en-US">🇺🇸 English (US)</option>
                        <option value="es-ES">🇪🇸 Español</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Formato de Hora
                      </label>
                      <select
                        name="timeFormat"
                        value={userData.timeFormat}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="24h">24 horas</option>
                        <option value="12h">12 horas (AM/PM)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Salvamento Automático
                        </label>
                        <p className="text-sm text-gray-400">
                          Salvar alterações automaticamente
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="autoSave"
                          checked={userData.autoSave}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Notificações
                      </label>
                      <p className="text-sm text-gray-400">
                        Receber notificações de lembretes
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="notifications"
                        checked={userData.notifications}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                    >
                      💾 Salvar Preferências
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "data" && (
                <div className="space-y-6">
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      📦 Backup de Dados
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Exporte seus dados para backup ou migração para outro
                      dispositivo.
                    </p>
                    <button
                      onClick={handleExportData}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                    >
                      📤 Exportar Todos os Dados
                    </button>
                  </div>

                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      📥 Restaurar Dados
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Importe dados de um backup anterior.
                    </p>
                    <label className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg transition-colors font-medium inline-block cursor-pointer">
                      📥 Importar Dados
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportData}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="bg-gray-700 p-6 rounded-lg border border-red-500">
                    <h3 className="text-lg font-semibold mb-4 text-red-400">
                      ⚠️ Zona de Perigo
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Esta ação não pode ser desfeita. Todos os seus dados serão
                      permanentemente apagados.
                    </p>
                    <button
                      onClick={handleClearData}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                    >
                      🗑️ Limpar Todos os Dados
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6">
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      🔑 Alterar Senha
                    </h3>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Senha Atual
                        </label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Digite sua senha atual"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nova Senha
                        </label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Digite a nova senha"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Confirmar Nova Senha
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Confirme a nova senha"
                          required
                        />
                      </div>

                      {passwordMessage.text && (
                        <div className={`p-3 rounded-lg text-sm ${passwordMessage.type === 'error' ? 'bg-red-900/50 text-red-200 border border-red-500' : 'bg-green-900/50 text-green-200 border border-green-500'}`}>
                          {passwordMessage.text}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-6 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2"
                      >
                        {isChangingPassword ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Salvando...</span>
                          </>
                        ) : (
                          <>
                            <span>💾</span>
                            <span>Salvar Nova Senha</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-yellow-400">
                      📱 Autenticação de Dois Fatores
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Adicione uma camada extra de segurança à sua conta. (Em breve)
                    </p>
                    <button disabled className="bg-gray-600 text-gray-400 px-6 py-2 rounded-lg cursor-not-allowed">
                      Configurar 2FA
                    </button>
                  </div>
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      📋 Sessões Ativas
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gray-600 rounded-xl border border-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">
                            {sessionInfo.device === "Celular" ? "📱" : sessionInfo.device === "Tablet" ? "平板" : "💻"}
                          </div>
                          <div>
                            <p className="font-semibold flex items-center gap-2">
                              {sessionInfo.os} ({sessionInfo.device})
                              <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">ATUAL</span>
                            </p>
                            <p className="text-sm text-gray-400">
                              {sessionInfo.browser} • {sessionInfo.ip}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                              Conectado agora em {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]"></span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 text-center italic">
                        Por motivos de segurança, apenas sessões verificadas são listadas.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      🚪 Sair da Conta
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Encerrar sua sessão atual neste dispositivo.
                    </p>
                    <button
                      onClick={onLogout}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                    >
                      👋 Sair da Conta
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
