import React from "react";

// Map de categorias e prioridades
const CATEGORY_LABELS = {
  work: "Trabalho",
  studies: "Estudos",
  health: "Saúde",
  personal: "Pessoal",
};

const PRIORITY_LABELS = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};

// Ícones de categoria
const CATEGORY_ICONS = {
  work: "💼",
  studies: "📚",
  health: "🏥",
  personal: "👤",
};

const PRIORITY_COLORS = {
  high: "bg-red-500",
  medium: "bg-yellow-400",
  low: "bg-green-500",
};

const TaskItem = ({ task, onEdit, onToggleCompletion, onDelete, categories = [] }) => {
  // Busca a categoria correspondente para pegar o label e a cor
  const categoryInfo = categories.find(c => c.value === task.category) || {
    label: task.category,
    color: "#6B7280" // Cinza padrão se não encontrar
  };
  // 🔹 CORREÇÃO DE DATA: Trata string 'YYYY-MM-DD' como data local
  const parseDate = (dateString) => {
    if (!dateString) return null;
    // Se vier 'YYYY-MM-DD', adiciona horário local para evitar fuso UTC
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDate = parseDate(task.dueDate);
  
  const isOverdue = taskDate && taskDate < today && !task.completed;
  const isToday = taskDate && taskDate.toDateString() === today.toDateString();

  const formatDate = (dateString) => {
    const date = parseDate(dateString);
    if (!date) return "Sim data";
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div
      className={`bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-md transition-all hover:border-green-500 hover:shadow-lg ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        {/* Task Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start space-x-3">
            {/* Checkbox */}
            <button
              onClick={onToggleCompletion}
              aria-label="Marcar como concluída"
              className={`flex-shrink-0 w-5 h-5 rounded border-2 mt-1 transition-all ${
                task.completed
                  ? "bg-green-500 border-green-500"
                  : "border-gray-500 hover:border-green-400"
              }`}
            >
              {task.completed && (
                <svg
                  className="w-3 h-3 text-white mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3
                className={`font-semibold text-white mb-1 ${
                  task.completed ? "line-through" : ""
                }`}
              >
                {task.title}
              </h3>

              {task.description && (
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                  {task.description}
                </p>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                {/* Data */}
                <div className="flex items-center space-x-1">
                  <span>📅</span>
                  <span
                    className={
                      isOverdue
                        ? "text-red-400"
                        : isToday
                        ? "text-yellow-400"
                        : ""
                    }
                  >
                    {formatDate(task.dueDate)}
                    {isOverdue && " ⚠️"}
                    {isToday && " (Hoje)"}
                  </span>
                </div>

                {/* Categoria */}
                <div className="flex items-center space-x-1">
                  <span className="text-base mr-0.5">
                    {categoryInfo.icon || "📁"}
                  </span>
                  <span className="capitalize">
                    {categoryInfo.label}
                  </span>
                </div>

                {/* Prioridade */}
                <div className="flex items-center space-x-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      PRIORITY_COLORS[task.priority] || "bg-gray-500"
                    }`}
                  ></div>
                  <span className="capitalize">
                    {PRIORITY_LABELS[task.priority] || "Média"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={onEdit}
            aria-label="Editar tarefa"
            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <button
            onClick={onDelete}
            aria-label="Excluir tarefa"
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
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
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
