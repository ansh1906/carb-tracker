import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import useDarkMode from '../hooks/darkMode';

function Navbar({ onSidebarToggle }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useDarkMode();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 py-4 bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="flex items-center gap-3 md:gap-6">
        {onSidebarToggle && (
          <button
            onClick={onSidebarToggle}
            className="md:hidden rounded-lg border border-gray-200 dark:border-gray-700 p-2 text-[#1C1C1E] dark:text-[#F5F5F7] hover:bg-gray-100 dark:hover:bg-[#2C2C2E]"
            aria-label="Open navigation menu"
            title="Open navigation menu"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        )}
        <span className="text-lg md:text-xl font-semibold text-[#1C1C1E] dark:text-[#F5F5F7]">
          GlucoTrack
        </span>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <button
          onClick={toggleTheme}
          className="text-sm bg-white dark:bg-[#1C1C1E] border border-gray-200 dark:border-gray-700 px-3 py-2 text-[#6E6E73] dark:text-[#9B9BA1] hover:text-[#1C1C1E] rounded-full dark:hover:text-white transition-colors duration-300"
        >
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>

        <button
          onClick={handleLogout}
          className="text-sm font-medium text-white bg-[#a52121] px-4 py-2 rounded-full hover:bg-[#8c1b1b] transition-colors"
        >
          Logout
        </button>

        <button
          onClick={() => navigate('/profile')}
          className="text-sm font-medium text-white bg-[#2563EB] px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
        >
          Account
        </button>
      </div>
    </nav>
  );
}

export default Navbar;