import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AiAssistant from './pages/AiAssistant';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';

type AuthView = 'login' | 'register';

function App() {
  const { isAuthenticated } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('login');
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show auth screen if not logged in
  if (!isAuthenticated) {
    if (authView === 'register') {
      return <Register onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <Login onSwitchToRegister={() => setAuthView('register')} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-light dark:bg-bg-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Sidebar Wrapper (Mobile + Desktop) */}
      <div className={`fixed inset-y-0 left-0 z-30 transform md:relative md:translate-x-0 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar currentTab={currentTab} setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setSidebarOpen(false);
        }} />
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-bg-light dark:bg-bg-dark transition-colors duration-300 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {currentTab === 'dashboard' && <Dashboard onNavigate={setCurrentTab} />}
            {currentTab === 'transactions' && <Transactions />}
            {currentTab === 'analytics' && <Analytics />}
            {currentTab === 'assistant' && <AiAssistant />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
