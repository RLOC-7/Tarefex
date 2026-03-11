import { useState } from "react";

const Header = ({ onLogout, onProfile, onTasks, onDashboard, onSettings }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleItemClick = (callback) => {
    if (callback) callback(); // Executa a função de navegação
    setIsMenuOpen(false); // Fecha o menu no mobile
  };

  const menuItems = [
    { label: "Dashboard", onClick: onDashboard, icon: "📊" },
    { label: "Tarefas", onClick: onTasks, icon: "✅" },
    { label: "Configurações", onClick: onSettings, icon: "⚙️" },
    { label: "Perfil", onClick: onProfile, icon: "👤" },
    { label: "Sair", onClick: onLogout, icon: "🚪", textColor: "text-red-400" },
  ];

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 shadow-lg border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={onTasks}
          >
            <span className="text-2xl text-green-500">📝</span>
            <span className="text-2xl font-bold text-white">Tarefex</span>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              {menuItems.map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleItemClick(item.onClick)}
                    className={`px-4 py-2 rounded-lg text-gray-200 hover:text-white hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2 ${
                      item.textColor || ""
                    }`}
                    aria-label={item.label}
                    title={item.label}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="hidden lg:inline">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Botão Mobile */}
          <button
            aria-label="Menu mobile"
            className="md:hidden text-gray-200 hover:text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 bg-gray-800 rounded-lg p-4 border border-gray-700">
            <ul className="space-y-3">
              {menuItems.map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleItemClick(item.onClick)}
                    className={`w-full text-left px-4 py-3 rounded-md text-gray-200 hover:text-white hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-3 ${
                      item.textColor || ""
                    }`}
                    aria-label={item.label}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
