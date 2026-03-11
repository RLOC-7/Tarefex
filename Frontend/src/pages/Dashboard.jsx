import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Cell
} from "recharts";

const Dashboard = ({
  onNavigateToTasks,
  onNavigateToProfile,
  onNavigateToSettings,
  tasks,
  categories
}) => {
  const [stats, setStats] = useState({
    totalTarefas: 0,
    tarefasConcluidas: 0,
    tarefasPendentes: 0,
    produtividade: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (tasks) {
      const totalTarefas = tasks.length;
      const tarefasConcluidas = tasks.filter(t => t.completed).length;
      const tarefasPendentes = totalTarefas - tarefasConcluidas;
      const produtividade = totalTarefas > 0 ? Math.round((tarefasConcluidas / totalTarefas) * 100) : 0;

      setStats({
        totalTarefas,
        tarefasConcluidas,
        tarefasPendentes,
        produtividade,
      });
      setIsLoading(false);
    }
  }, [tasks]);

  // 🔹 Dados reais baseados nas tarefas
  const getWeeklyData = () => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const counts = [0, 0, 0, 0, 0, 0, 0];

    if (tasks && tasks.length > 0) {
      tasks.forEach(task => {
        if (task.createdAt) {
          try {
            const date = new Date(task.createdAt);
            const dayIndex = date.getDay(); // 0 = Dom, 1 = Seg, etc.
            counts[dayIndex]++;
          } catch (e) {
            console.error("Erro ao processar data da tarefa:", e);
          }
        }
      });
    }

    // Reordenar para começar na Segunda (opcional, conforme layout original)
    // Layout original tinha: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
    const orderedLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const orderedCounts = [counts[1], counts[2], counts[3], counts[4], counts[5], counts[6], counts[0]];

    return orderedLabels.map((day, index) => ({
      name: day,
      tarefas: orderedCounts[index]
    }));
  };

  // 🔹 Dados para gráfico de categorias
  const getCategoryData = () => {
    if (!tasks || tasks.length === 0) return [];

    const categoryCount = {};
    tasks.forEach(task => {
      if (task.category) {
        // Busca a categoria correspondente para pegar o label
        const categoryObj = categories?.find(c => c.value === task.category);
        const displayName = categoryObj ? (categoryObj.label || categoryObj.name) : task.category;
        
        categoryCount[displayName] = (categoryCount[displayName] || 0) + 1;
      }
    });

    return Object.entries(categoryCount).map(([name, tarefas]) => ({
      name,
      tarefas
    }));
  };

  const weeklyData = getWeeklyData();
  const categoryData = getCategoryData();

  // 🔹 Cores para as categorias
  const categoryColors = {
    work: '#EF4444',
    studies: '#3B82F6',
    health: '#10B981',
    personal: '#FD79A8',
    // Adicione mais cores conforme necessário
  };

  const getCategoryColor = (categoryLabel) => {
    // Busca na lista de categorias pelo label ou name para pegar a cor correta
    const categoryObj = categories?.find(c => (c.label || c.name) === categoryLabel);
    return categoryObj?.color || categoryColors[categoryLabel.toLowerCase()] || '#6B7280';
  };

  // 🔹 Obter nome do usuário do localStorage
  const getUserName = () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      return userData?.name || 'Visitante';
    } catch (e) {
      return 'Visitante';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-400">📊 Dashboard, {getUserName()}!</h1>
          <p className="text-gray-300">Aqui está um resumo do seu desempenho.</p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {isLoading ? (
            // Skeleton loading
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl p-5 border border-gray-700 animate-pulse">
                <div className="h-6 bg-gray-700 rounded mb-3"></div>
                <div className="h-8 bg-gray-700 rounded"></div>
              </div>
            ))
          ) : (
            <>
              <div className="bg-gray-800 shadow-lg rounded-2xl p-5 border border-gray-700 hover:scale-105 transition-transform">
                <h2 className="text-lg font-semibold">Total de Tarefas</h2>
                <p className="text-3xl font-bold text-green-400">{stats.totalTarefas}</p>
              </div>
              <div className="bg-gray-800 shadow-lg rounded-2xl p-5 border border-gray-700 hover:scale-105 transition-transform">
                <h2 className="text-lg font-semibold">Concluídas</h2>
                <p className="text-3xl font-bold text-green-400">{stats.tarefasConcluidas}</p>
              </div>
              <div className="bg-gray-800 shadow-lg rounded-2xl p-5 border border-gray-700 hover:scale-105 transition-transform">
                <h2 className="text-lg font-semibold">Pendentes</h2>
                <p className="text-3xl font-bold text-yellow-400">{stats.tarefasPendentes}</p>
              </div>
              <div className="bg-gray-800 shadow-lg rounded-2xl p-5 border border-gray-700 hover:scale-105 transition-transform">
                <h2 className="text-lg font-semibold">Produtividade</h2>
                <p className="text-3xl font-bold text-blue-400">{stats.produtividade}%</p>
              </div>
            </>
          )}
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico semanal */}
          <div className="bg-gray-800 shadow-lg rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-green-400">📈 Tarefas por dia da semana</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    color: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #374151"
                  }}
                />
                <Bar dataKey="tarefas" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de categorias */}
          <div className="bg-gray-800 shadow-lg rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-green-400">🏷️ Tarefas por categoria</h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      color: "#fff",
                      borderRadius: "8px",
                      border: "1px solid #374151"
                    }}
                  />
                  <Bar dataKey="tarefas">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                Nenhuma tarefa com categoria definida
              </div>
            )}
          </div>
        </div>

        {/* Atalhos rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={onNavigateToTasks}
            className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl shadow-md transition transform hover:scale-105 font-semibold"
          >
            📌 Ir para Tarefas
          </button>
          <button
            onClick={onNavigateToProfile}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-md transition transform hover:scale-105 font-semibold"
          >
            👤 Ver Perfil
          </button>
          <button
            onClick={onNavigateToSettings}
            className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl shadow-md transition transform hover:scale-105 font-semibold"
          >
            ⚙️ Configurações
          </button>
        </div>

        {/* Estatísticas adicionais */}
        {!isLoading && stats.totalTarefas > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-green-400">📋 Resumo de Produtividade</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-300">Taxa de conclusão:</p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-bold">{stats.produtividade}%</span>
                    <span className="text-sm text-gray-400">{stats.tarefasConcluidas}/{stats.totalTarefas}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stats.produtividade}%` }}
                    ></div>
                  </div>
                </div>

                {stats.tarefasPendentes > 0 && (
                  <div>
                    <p className="text-gray-300">Tarefas pendentes:</p>
                    <p className="text-yellow-400 font-bold">{stats.tarefasPendentes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-green-400">🎯 Metas e Insights</h3>
              <div className="space-y-2">
                <p className="text-gray-300">
                  {stats.produtividade >= 80 ? (
                    <span className="text-green-400">🎉 Excelente produtividade!</span>
                  ) : stats.produtividade >= 50 ? (
                    <span className="text-yellow-400">👍 Bom progresso!</span>
                  ) : (
                    <span className="text-red-400">💪 Vamos melhorar!</span>
                  )}
                </p>
                <p className="text-sm text-gray-400">
                  {stats.tarefasPendentes > 0
                    ? `Você tem ${stats.tarefasPendentes} tarefas para concluir.`
                    : 'Todas as tarefas concluídas! 🎊'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;