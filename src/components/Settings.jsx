import { useState } from "react";

const Settings = ({ onNavigateToTasks }) => {
  const [settings, setSettings] = useState({
    theme: "dark",
    notifications: true,
    emailUpdates: false,
    language: "pt-BR",
    autoSave: true,
    timeFormat: "24h",
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    // Simular salvamento das configurações
    localStorage.setItem("tarefex-settings", JSON.stringify(settings));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Tem certeza que deseja restaurar as configurações padrão?"
      )
    ) {
      setSettings({
        theme: "dark",
        notifications: true,
        emailUpdates: false,
        language: "pt-BR",
        autoSave: true,
        timeFormat: "24h",
      });
      setIsSaved(false);
    }
  };

  const handleExportData = () => {
    const data = localStorage.getItem("tarefex-tasks");
    const blob = new Blob([data || ""], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tarefex-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (
            window.confirm(
              "Tem certeza que deseja importar estes dados? Isso substituirá suas tarefas atuais."
            )
          ) {
            localStorage.setItem("tarefex-tasks", JSON.stringify(data));
            window.location.reload(); // Recarrega para aplicar as mudanças
          }
        } catch {
          alert("Erro ao importar arquivo. Verifique se é um JSON válido.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearData = () => {
    if (
      window.confirm(
        "⚠️ ATENÇÃO: Isso apagará TODAS as suas tarefas. Tem certeza?"
      )
    ) {
      if (
        window.confirm(
          "⚠️ CONFIRMAÇÃO FINAL: Esta ação não pode ser desfeita. Apagar todas as tarefas?"
        )
      ) {
        localStorage.removeItem("tarefex-tasks");
        window.location.reload();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-400">
            ⚙️ Configurações
          </h1>
          <p className="text-gray-300">
            Personalize sua experiência no Tarefex
          </p>
        </div>

        {/* Configurações de Aparência */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-6">
          <h2 className="text-xl font-semibold text-green-400 mb-4">
            🎨 Aparência
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tema
              </label>
              <select
                name="theme"
                value={settings.theme}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="dark">Escuro</option>
                <option value="light">Claro</option>
                <option value="auto">Automático</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Formato de Hora
              </label>
              <select
                name="timeFormat"
                value={settings.timeFormat}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="24h">24 horas</option>
                <option value="12h">12 horas (AM/PM)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Configurações de Notificações */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-6">
          <h2 className="text-xl font-semibold text-green-400 mb-4">
            🔔 Notificações
          </h2>

          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
                className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
              />
              <span className="text-gray-300">Receber notificações</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="emailUpdates"
                checked={settings.emailUpdates}
                onChange={handleChange}
                className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
              />
              <span className="text-gray-300">
                Receber atualizações por email
              </span>
            </label>
          </div>
        </div>

        {/* Configurações Gerais */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-6">
          <h2 className="text-xl font-semibold text-green-400 mb-4">
            ⚡ Geral
          </h2>

          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="autoSave"
                checked={settings.autoSave}
                onChange={handleChange}
                className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
              />
              <span className="text-gray-300">Salvamento automático</span>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Idioma
              </label>
              <select
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>
          </div>
        </div>

        {/* Gerenciamento de Dados */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-6">
          <h2 className="text-xl font-semibold text-green-400 mb-4">
            💾 Gerenciamento de Dados
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleExportData}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
            >
              📤 Exportar Dados
            </button>

            <label className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors font-medium text-center cursor-pointer">
              📥 Importar Dados
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>

            <button
              onClick={handleClearData}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
            >
              🗑️ Limpar Dados
            </button>
          </div>

          <p className="text-sm text-gray-400 mt-4">
            💡 Exporte suas tarefas para backup ou importe de uma instalação
            anterior.
          </p>
        </div>

        {/* Ações */}
        <div className="flex space-x-4">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors font-medium flex items-center space-x-2"
          >
            {isSaved ? "✅ Salvo!" : "💾 Salvar Configurações"}
          </button>

          <button
            onClick={handleReset}
            className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg transition-colors font-medium"
          >
            🔄 Restaurar Padrão
          </button>

          <button
            onClick={onNavigateToTasks}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors font-medium"
          >
            ← Voltar para Tarefas
          </button>
        </div>

        {/* Informações do Sistema */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-green-400 mb-4">
            ℹ️ Informações do Sistema
          </h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Versão do App</p>
              <p className="text-white">1.0.0</p>
            </div>
            <div>
              <p className="text-gray-400">Última atualização</p>
              <p className="text-white">25 Dez 2024</p>
            </div>
            <div>
              <p className="text-gray-400">Armazenamento usado</p>
              <p className="text-white">
                ~
                {localStorage.getItem("tarefex-tasks")
                  ? Math.round(
                      localStorage.getItem("tarefex-tasks").length / 1024
                    )
                  : 0}{" "}
                KB
              </p>
            </div>
            <div>
              <p className="text-gray-400">Navegador</p>
              <p className="text-white">{navigator.userAgent.split(" ")[0]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
