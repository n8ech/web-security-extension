import React from 'react';
import { FiHome, FiSettings, FiShield, FiList, FiLock } from 'react-icons/fi';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'home', icon: <FiHome size={24} />, title: 'Accueil' },
    { id: 'password', icon: <FiLock size={24} />, title: 'Mot de passe (en cours de développement)' },
    { id: 'security', icon: <FiShield size={24} />, title: 'Sécurité' },
    { id: 'settings', icon: <FiSettings size={24} />, title: 'Paramètres' },
  ];

  return (
    <div className="w-20 bg-gray-100 flex flex-col h-full items-center justify-evenly py-4">
      {menuItems.map((item) => (
        <div
          key={item.id}
          className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
            activeView === item.id
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveView(item.id)}
          title={item.title}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
};

export default Sidebar; 