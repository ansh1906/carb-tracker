import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import useDarkMode from '../hooks/darkMode';

function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useDarkMode();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-[#1C1C1E] border-b border-gray-100 dark:border-gray-800">
      <span className="text-lg font-semibold text-[#1C1C1E] dark:text-[#F5F5F7]">
        GlucoTrack
      </span>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="text-sm text-[#6E6E73] dark:text-[#9B9BA1] hover:text-[#1C1C1E] dark:hover:text-white transition-colors"
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>

        <button
          onClick={handleLogout}
          className="text-sm font-medium text-white bg-[#2563EB] px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;