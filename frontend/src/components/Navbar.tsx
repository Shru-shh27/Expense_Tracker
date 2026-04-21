import { Sun, Moon, Bell, Menu } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur-md sticky top-0 z-10 w-full transition-colors duration-300">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            id="navbar-menu-btn"
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu size={24} />
          </button>
          
          <div className="relative hidden sm:block">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all w-64 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1 right-2 w-2 h-2 bg-danger rounded-full"></span>
          </button>
          
          <button 
            onClick={toggleDarkMode}
            id="navbar-theme-toggle"
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white font-bold text-xs cursor-default select-none">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
