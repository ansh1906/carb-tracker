import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { logout } from '../services/authService';
import useDarkMode from '../hooks/darkMode';

function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useDarkMode();
  const [insightsOpen, setInsightsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-[#1C1C1E] border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="flex items-center gap-8">
        <span className="text-lg font-semibold text-[#1C1C1E] dark:text-[#F5F5F7]">
          GlucoTrack
        </span>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-lg font-medium text-[#6E6E73] dark:text-[#9B9BA1] hover:text-[#1C1C1E] dark:hover:text-white transition-colors"
          >
            Home
          </button>

          <div className="relative">
            <button
              onClick={() => setInsightsOpen(!insightsOpen)}
              className="text-lg font-medium text-[#6E6E73] dark:text-[#9B9BA1] hover:text-[#1C1C1E] dark:hover:text-white transition-colors flex items-center gap-1"
            >
              Insights
              <span className={`text-1.2xl`}>
                ▾
              </span>
            </button>

            {insightsOpen && (
              <div className="absolute left-0 top-full mt-3 w-56 rounded-xl bg-white dark:bg-[#1C1C1E] border border-gray-100 dark:border-gray-800 shadow-lg py-2 z-50">
                <button
                  onClick={() => {
                    navigate('/insights/latest-research');
                    setInsightsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-[#6E6E73] dark:text-[#9B9BA1] hover:bg-gray-50 dark:hover:bg-[#2C2C2E] transition-colors"
                >
                  Insulin Do's & Dont's
                </button>

                <button
                  onClick={() => {
                    navigate('/insights/nutrition');
                    setInsightsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-[#6E6E73] dark:text-[#9B9BA1] hover:bg-gray-50 dark:hover:bg-[#2C2C2E] transition-colors"
                >
                  Nutrition & Diabetes
                </button>

                <button
                  onClick={() => {
                    navigate('/insights/technology');
                    setInsightsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-[#6E6E73] dark:text-[#9B9BA1] hover:bg-gray-50 dark:hover:bg-[#2C2C2E] transition-colors"
                >
                  Diabetes Technology
                </button>

                <button
                  onClick={() => {
                    navigate('/insights/news');
                    setInsightsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-[#6E6E73] dark:text-[#9B9BA1] hover:bg-gray-50 dark:hover:bg-[#2C2C2E] transition-colors"
                >
                  Diabetes News
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <button
          onClick={toggleTheme}
          className="text-sm bg-white ml-5.5 dark:bg-[#1C1C1E] border-b border-gray-100 dark:border-gray-800 text-[#6E6E73] dark:text-[#9B9BA1] hover:text-[#1C1C1E] rounded-full dark:hover:text-white transition-colors duration-300"
        >
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>

        <button
          onClick={handleLogout}
          className="text-sm font-medium text-white ml-1.5 bg-[#a52121] px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
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