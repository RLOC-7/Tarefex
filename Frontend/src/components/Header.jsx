import { useState, useRef, useEffect } from "react";

const Header = ({ onLogout, onProfile, onTasks, onDashboard, onSettings, user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const calculateLevel = (exp) => {
    const level = Math.floor((exp || 0) / 100) + 1;
    const progress = ((exp || 0) % 100);
    return { level, progress };
  };

  const { level, progress } = calculateLevel(user?.totalExp);

  const menuItems = [
    { label: "Dashboard", onClick: onDashboard, icon: "📊" },
    { label: "Minhas Tarefas", onClick: onTasks, icon: "✅" },
    { label: "Configurações", onClick: onSettings, icon: "⚙️" },
    { label: "Meu Perfil", onClick: onProfile, icon: "👤" },
    { label: "Sair da Conta", onClick: onLogout, icon: "🚪", isDanger: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 py-3">
      <div className="container mx-auto px-4 flex justify-between items-center">

        {/* Lado Esquerdo: Logo e Nível */}
        <div className="flex items-center space-x-6">
          <div
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={onTasks}
          >
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)] group-hover:scale-110 transition-transform">
              <span className="text-xl">📝</span>
            </div>
            <span className="text-2xl font-black text-white tracking-tight">Tarefex</span>
          </div>

          {/* Player Level Badge */}
          {user && (
            <div className="hidden sm:flex items-center bg-gray-800/50 border border-gray-700 rounded-full px-4 py-1.5 space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-lg">
                  {level}
                </div>
                {/* Mini barra circular de progresso em volta do level seria ideal, mas usaremos uma lateral */}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-1">NIVEL</span>
                <div className="w-24 bg-gray-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 h-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lado Direito: Nome e Menu Dropdown */}
        <div className="flex items-center space-x-4">
          {user && (
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-white line-clamp-1">{user.name} {user.lastname}</span>
              <span className="text-[10px] text-green-400 font-mono">{user.totalExp} XP TOTAL</span>
            </div>
          )}

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 p-1.5 px-3 rounded-xl border border-gray-700 transition-all active:scale-95"
            >
              <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center text-lg">
                👤
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden py-2 animate-in fade-in zoom-in duration-200">
                <div className="px-4 py-2 border-b border-gray-700 mb-2 md:hidden">
                  <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                  <p className="text-[10px] text-green-400">Lvl {level} • {user?.totalExp} XP</p>
                </div>

                {menuItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      item.onClick();
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${item.isDanger
                        ? 'text-red-400 hover:bg-red-400/10'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
