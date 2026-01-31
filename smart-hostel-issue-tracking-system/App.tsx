
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, UserRole } from './types';
import { apiService } from './services/apiService';

// Pages
import Login from './pages/Login';
import DashboardStudent from './pages/DashboardStudent';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardCaretaker from './pages/DashboardCaretaker';
import LostAndFound from './pages/LostAndFound';
import AnnouncementsPage from './pages/Announcements';
import IssueDetail from './pages/IssueDetail';
import Profile from './pages/Profile';

// Components
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(apiService.getCurrentUser());
  const location = useLocation();

  const handleLogin = (u: User) => {
    setUser(u);
  };

  const handleLogout = () => {
    apiService.logout();
    setUser(null);
  };

  const isAuthPage = location.pathname === '/login';

  if (!user && !isAuthPage) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {!isAuthPage && user && (
        <Sidebar user={user} onLogout={handleLogout} />
      )}
      
      <main className={`flex-1 overflow-y-auto ${!isAuthPage ? 'p-4 md:p-8' : ''}`}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
          
          <Route path="/" element={
            user?.role === UserRole.STUDENT ? <DashboardStudent user={user} /> :
            user?.role === UserRole.ADMIN ? <DashboardAdmin user={user} /> :
            user?.role === UserRole.CARETAKER ? <DashboardCaretaker user={user} /> :
            <Navigate to="/login" />
          } />

          <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
          <Route path="/issues/:id" element={<IssueDetail user={user!} />} />
          <Route path="/lost-found" element={<LostAndFound user={user!} />} />
          <Route path="/announcements" element={<AnnouncementsPage user={user!} />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
