import { useState } from "react";

const Sidebar = ({
  tasks,
  filters,
  onFilterChange,
  searchTerm,
  onSearchChange,
  onClearCompleted,
  categories,
  onAddCategory,
  onEditCategory
}) => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isPriorityOpen, setIsPriorityOpen] = useState(true);

  const priorities = [
    { value: "high", label: "Alta", color: "text-red-400" },
    { value: "medium", label: "Média", color: "text-yellow-400" },
    { value: "low", label: "Baixa", color: "text-blue-400" },
  ];

  const completedTasks = tasks.filter((task) => task.completed).length;

  const getCategoryCount = (categoryValue) =>
    tasks.filter((task) => task.category === categoryValue).length;

  const getPriorityCount = (priority) =>
    tasks.filter((task) => task.priority === priority).length;

  // 🔹 Funções de Gerenciamento de Filtros
  const toggleCategory = (value) => {
    const newCategories = filters.categories.includes(value)
      ? filters.categories.filter((c) => c !== value)
      : [...filters.categories, value];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const togglePriority = (value) => {
    const newPriorities = filters.priorities.includes(value)
      ? filters.priorities.filter((p) => p !== value)
      : [...filters.priorities, value];
    onFilterChange({ ...filters, priorities: newPriorities });
  };

  const handleStatusChange = (status) => {
    onFilterChange({ ...filters, status });
  };

  const clearAllFilters = () => {
    onSearchChange("");
    onFilterChange({ status: "all", categories: [], priorities: [] });
  };

  const hasActiveFilters = 
    searchTerm !== "" || 
    filters.status !== "all" || 
    filters.categories.length > 0 || 
    filters.priorities.length > 0;

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      {/* Header com Limpar Filtros */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Filtros</h2>
        {hasActiveFilters && (
          <button 
            onClick={clearAllFilters}
            className="text-xs text-green-400 hover:text-green-300 font-medium transition-colors"
          >
            Limpar tudo
          </button>
        )}
      </div>

      {/* Buscar tarefas */}
      <div className="mb-6">
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Buscar tarefas
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="search"
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="space-y-6">
        {/* Status */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Status</h3>
          <div className="space-y-2">
            {["all", "active", "completed"].map((status) => (
              <label
                key={status}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="status"
                  checked={filters.status === status}
                  onChange={() => handleStatusChange(status)}
                  className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 focus:ring-green-500"
                  aria-label={status}
                />
                <span className="text-gray-300 group-hover:text-white transition-colors capitalize text-sm">
                  {status === "all"
                    ? "Todas"
                    : status === "active"
                    ? "Pendentes"
                    : "Concluídas"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Categorias dinâmicas */}
        <div>
          <h3
            className="text-lg font-semibold text-white mb-3 flex items-center justify-between cursor-pointer"
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
          >
            <span>Categorias</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                isCategoriesOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </h3>
          {isCategoriesOpen && (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {categories.map((cat, index) => (
                <label
                  key={cat.value || index}
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(cat.value)}
                    onChange={() => toggleCategory(cat.value)}
                    className="w-4 h-4 rounded text-green-500 bg-gray-700 border-gray-600 focus:ring-green-500"
                  />
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="text-lg w-6 text-center select-none">
                        {cat.icon || "📁"}
                      </span>
                      <span className="text-gray-300 group-hover:text-white transition-colors text-sm truncate">
                        {cat.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                       <span className="text-[10px] text-gray-500 bg-gray-900 px-1.5 py-0.5 rounded-full flex-shrink-0">
                        {getCategoryCount(cat.value)}
                      </span>
                      {/* Botão Editar (Apenas para categorias customizadas) */}
                      {cat.id && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            onEditCategory(cat);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-blue-400 transition-all p-1"
                          title="Editar Categoria"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </label>
              ))}

              {/* Botão de adicionar categoria */}
              <button
                onClick={() => onAddCategory()}
                className="mt-2 w-full border border-gray-600 border-dashed hover:border-green-500 hover:text-green-500 text-gray-400 py-1.5 px-2 rounded-lg transition text-xs font-medium"
              >
                + Nova categoria
              </button>
            </div>
          )}
        </div>

        {/* Prioridade */}
        <div>
          <h3
            className="text-lg font-semibold text-white mb-3 flex items-center justify-between cursor-pointer"
            onClick={() => setIsPriorityOpen(!isPriorityOpen)}
          >
            <span>Prioridade</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                isPriorityOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </h3>
          {isPriorityOpen && (
            <div className="space-y-2">
              {priorities.map((p) => (
                <label
                  key={p.value} 
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.priorities.includes(p.value)}
                    onChange={() => togglePriority(p.value)}
                    className="w-4 h-4 rounded text-green-500 bg-gray-700 border-gray-600 focus:ring-green-500"
                  />
                  <div className="flex-1 flex items-center justify-between">
                    <span className={`text-sm group-hover:text-white transition-colors ${p.color}`}>
                      {p.label}
                    </span>
                    <span className="text-[10px] text-gray-500 bg-gray-900 px-1.5 py-0.5 rounded-full">
                      {getPriorityCount(p.value)}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Limpar tarefas concluídas */}
        {completedTasks > 0 && (
          <button
            onClick={onClearCompleted}
            className="w-full bg-gray-700 hover:bg-red-900/40 text-gray-300 hover:text-red-400 py-2 px-4 rounded-lg transition-all border border-gray-600 hover:border-red-500/50 font-medium text-xs flex items-center justify-center space-x-2"
          >
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span>Limpar concluídas ({completedTasks})</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;