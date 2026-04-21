import { LayoutDashboard, MessageSquareText, Receipt, PieChart, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function Sidebar({ currentTab, setCurrentTab }: SidebarProps) {
  const { user, logout } = useAuth();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'assistant', label: 'AI Assistant', icon: MessageSquareText },
  ];

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-bg-light dark:bg-bg-dark border-r border-slate-200 dark:border-slate-800 transition-colors duration-300 h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white">
            <LayoutDashboard size={18} />
          </div>
          ExpenseAI
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`sidebar-${tab.id}`}
              onClick={() => setCurrentTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive 
                  ? 'bg-primary text-white shadow-md shadow-primary/30' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : ''} />
              {tab.label}
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 p-2 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name ?? 'User'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email ?? ''}</p>
          </div>
        </div>
        <button
          id="sidebar-logout"
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-danger transition-colors font-medium"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
