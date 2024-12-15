import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BarChart3, Users, Settings, LogOut } from 'lucide-react';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role') || 'donor';

  const navigation = {
    donor: [
      { name: 'Dashboard', path: '/dashboard-donor', icon: Home },
      { name: 'Projects', path: '/projects', icon: BarChart3 },
      { name: 'Profile', path: '/public-profile', icon: Users }
    ],
    creator: [
      { name: 'Dashboard', path: '/dashboard-creator', icon: Home },
      { name: 'My Projects', path: '/projects', icon: BarChart3 },
      { name: 'Create Project', path: '/projects/recurring-fundraiser', icon: Settings }
    ],
    admin: [
      { name: 'Dashboard', path: '/dashboard-admin', icon: Home },
      { name: 'Projects', path: '/projects', icon: BarChart3 },
      { name: 'Users', path: '/users', icon: Users }
    ]
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Rest of your layout code... */}
    </div>
  );
};

export default Layout;