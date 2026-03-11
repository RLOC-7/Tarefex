const StatCard = ({ icon, value, label, color }) => {
  return (
    <div className="bg-gray-750 border border-gray-700 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
      <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center mx-auto mb-3 text-xl`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400 uppercase tracking-wide">{label}</div>
    </div>
  );
};

export default StatCard;