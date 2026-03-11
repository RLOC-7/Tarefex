import { useState, useEffect } from "react";

const EMOJI_LIST = [
  // Trabalho / Produtividade
  "💼","📁","📂","🗂️","📊","📈","📉","🧾","📑","📝","📋","📌","📎","📏","💻","⌨️","🖥️",

  // Estudo / Aprendizado
  "📚","📖","📕","📗","📘","📙","🧠","🎓","✏️","🖊️","🔬","🧪","📐",

  // Tecnologia
  "💻","🖥️","📱","⌨️","🖱️","🧑‍💻","🔌","💾","🗄️","🌐","🛜",

  // Casa / Vida pessoal
  "🏠","🛋️","🛏️","🚿","🧹","🧺","🧼","🪴","🧯","🔑",

  // Compras / Finanças
  "🛒","🛍️","💰","💳","🏦","💵","💸","🧾","📦",

  // Saúde / Bem-estar
  "🏥","💊","🩺","🧴","🧘","🧘‍♂️","💪","🏃","🚶","🧠","😴",

  // Esporte / Atividade
  "⚽","🏀","🏐","🎾","🏓","🏋️","🚴","🥊","🏊","🥾",

  // Alimentação
  "🍎","🍊","🍌","🥗","🍔","🍕","🍳","🍱","🍜","🍰","☕","🍵","🥤",

  // Lazer / Entretenimento
  "🎮","🎲","🎯","🎬","🎧","🎵","🎤","📺","📷","🎨",

  // Viagem / Transporte
  "✈️","🚗","🚕","🚌","🚆","🚲","🛴","🗺️","🧳","🏝️",

  // Natureza
  "🌱","🌿","🌳","🌵","🌸","🌞","🌙","⭐","🌧️","❄️",

  // Organização / Planejamento
  "📅","🗓️","⏰","⏳","📌","📍","🧭","📝","📋",

  // Status de tarefas
  "✅","☑️","✔️","❌","⛔","⚠️","🔄","⏳","🚧","🆕",

  // Prioridade / Importância
  "🔴","🟠","🟡","🟢","🔵","⭐","🔥","💡","📢",

  // Pessoas / Social
  "👤","👥","🧑","👨‍👩‍👧","💬","📞","📧","🤝"
];

const CategoryModal = ({ onClose, onSave, category, isEditing }) => {
  const [formData, setFormData] = useState({
    label: "",
    color: "#6c5ce7",
    icon: "📁"
  });

  useEffect(() => {
    if (category) {
      setFormData({
        label: category.label || "",
        color: category.color || "#6c5ce7",
        icon: category.icon || "📁"
      });
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.label.trim()) return;
    
    onSave({
      ...category,
      label: formData.label.trim(),
      color: formData.color,
      icon: formData.icon
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[60]">
      <div className="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {isEditing ? "Editar Categoria" : "Nova Categoria"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Visual Preview */}
          <div className="flex justify-center">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner border-2"
              style={{ backgroundColor: `${formData.color}33`, borderColor: formData.color }}
            >
              {formData.icon}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Ex: Trabalho, Estudos..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Cor</label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-12 h-12 p-1 rounded cursor-pointer border border-gray-600 bg-gray-700"
                />
                <span className="text-gray-400 text-sm">{formData.color.toUpperCase()}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Ícone (Emoji)</label>
              <div className="grid grid-cols-8 gap-2 bg-gray-700 p-3 rounded-lg max-h-40 overflow-y-auto custom-scrollbar">
                {EMOJI_LIST.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: emoji })}
                    className={`text-xl p-1 rounded hover:bg-gray-600 transition-colors ${
                      formData.icon === emoji ? "bg-gray-500" : ""
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
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
              {isEditing ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
