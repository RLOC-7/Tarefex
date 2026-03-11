

import StatCard from "./StatCard";
import TaskItem from "./TaskItem";

const TaskManager = ({
  tasks = [],
  totalTasks = 0,
  completedTasks = 0,
  pendingTasks = 0,
  overdueTasks = 0,
  onAddTask = () => { },
  onEditTask = () => { },
  onToggleCompletion = () => { },
  onDeleteTask = () => { },
  categories = []
}) => {

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-white">Minhas Tarefas</h2>
        <button
          onClick={onAddTask}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Nova Tarefa</span>
        </button>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📋" value={totalTasks} label="Total" color="bg-blue-500" />
        <StatCard icon="✅" value={completedTasks} label="Concluídas" color="bg-green-500" />
        <StatCard icon="⏳" value={pendingTasks} label="Pendentes" color="bg-yellow-500" />
        <StatCard icon="⚠️" value={overdueTasks} label="Atrasadas" color="bg-red-500" />
      </div>

      {/* Lista de tarefas */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Nenhuma tarefa encontrada</h3>
            <p className="text-gray-500">Comece criando sua primeira tarefa!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
              onToggleCompletion={() => onToggleCompletion(task.id)}
              onDelete={() => onDeleteTask(task.id)}
              categories={categories}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskManager;
