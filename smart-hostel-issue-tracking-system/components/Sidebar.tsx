
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquareWarning, 
  PackageSearch, 
  Bell, 
  LogOut, 
  UserCircle2,
  Settings
} from 'lucide-react';
import { User, UserRole } from '../types';

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Lost & Found', path: '/lost-found', icon: PackageSearch },
    { name: 'Announcements', path: '/announcements', icon: Bell },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-dark-blue p-2 rounded-lg">
            <MessageSquareWarning className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-xl text-text-dark-grey tracking-tight">SmartHostel</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-light-blue text-primary-blue font-semibold shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-text-dark-grey'}
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-100">
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 w-full mb-6 p-3 bg-gray-100 hover:bg-light-blue rounded-xl transition-colors group"
        >
          <div className="bg-light-blue p-2 rounded-full group-hover:bg-primary-blue group-hover:bg-opacity-20 transition-colors">
            <UserCircle2 className="w-6 h-6 text-primary-blue" />
          </div>
          <div className="overflow-hidden text-left">
            <p className="text-sm font-semibold text-text-dark-grey truncate">{user.name}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">{user.role}</p>
          </div>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
