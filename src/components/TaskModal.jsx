import { useState, useEffect } from "react";

const DEFAULT_CATEGORIES = [
  { value: "work", label: "Trabalho", color: "#00b894" },
  { value: "studies", label: "Estudos", color: "#0984e3" },
  { value: "health", label: "Saúde", color: "#e17055" },
  { value: "personal", label: "Pessoal", color: "#fd79a8" },
];

const TaskModal = ({ onClose, onSave, task, isEditing, categories: propCategories, onAddCategory }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    category: "work",
    priority: "medium",
  });

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#6c5ce7");

  const categories = propCategories && propCategories.length > 0 ? propCategories : DEFAULT_CATEGORIES;

  // Carrega dados da tarefa para edição
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : "",
        category: task.category || (categories?.[0]?.value || "work"),
        priority: task.priority || "medium",
      });
    } else {
      setFormData(prev => ({
        ...prev,
        category: categories?.[0]?.value || "work"
      }));
    }
  }, [task, categories]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate,
      category: formData.category,
      priority: formData.priority,
    };

    if (isEditing && task) {
      taskData.id = task.id;
    }
    onSave(taskData);
    onClose();
  };

  // 🔹 FUNÇÃO MELHORADA: Adicionar categoria
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      alert("Digite um nome para a categoria!");
      return;
    }

    const categoryName = newCategoryName.trim();

    // 🔹 Verifica se já existe nas categorias do App.jsx (globais)
    const categoryExists = propCategories?.some(
      cat => cat.label?.toLowerCase() === categoryName.toLowerCase()
    );

    if (categoryExists) {
      alert(`A categoria "${categoryName}" já existe!`);
      return;
    }

    // 🔹 Chama a função do App.jsx para adicionar globalmente
    if (onAddCategory) {
      onAddCategory({
        name: categoryName, // 🔹 Envia o nome correto
        color: newCategoryColor
      });
    }

    // 🔹 Seleciona automaticamente a nova categoria
    const newCategoryValue = categoryName.toLowerCase().replace(/\s+/g, '-');
    setFormData(prev => ({ ...prev, category: newCategoryValue }));

    // Reset dos inputs
    setNewCategoryName("");
    setNewCategoryColor("#6c5ce7");
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {isEditing ? "Editar Tarefa" : "Nova Tarefa"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Título *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Título da tarefa"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descrição da tarefa (opcional)"
              rows={3}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Data de Vencimento *
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Categoria e Prioridade */}
          <div className="grid grid-cols-2 gap-4">
            {/* Categorias */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoria
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map((cat, index) => (
                  <option key={cat.value || index} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Prioridade */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Prioridade
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
              </select>
            </div>
          </div>

          {/* Criar nova categoria */}
          <div className="bg-gray-700 p-3 rounded-lg">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Criar Nova Categoria
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nome da categoria"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="color"
                value={newCategoryColor}
                onChange={(e) => setNewCategoryColor(e.target.value)}
                className="w-10 h-10 p-1 rounded cursor-pointer border border-gray-500"
                title="Cor da categoria"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors font-medium"
                title="Adicionar categoria"
              >
                + Add
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              A nova categoria será selecionada automaticamente
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
            >
              {isEditing ? "Atualizar" : "Criar"} Tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
