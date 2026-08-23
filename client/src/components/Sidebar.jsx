import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AUTO_COLLAPSE_MS = 14000;

function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!isDesktop || collapsed) {
      return;
    }

    let timer = window.setTimeout(() => {
      setCollapsed(true);
    }, AUTO_COLLAPSE_MS);

    const resetTimer = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        setCollapsed(true);
      }, AUTO_COLLAPSE_MS);
    };

    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    activityEvents.forEach((eventName) => window.addEventListener(eventName, resetTimer, { passive: true }));

    return () => {
      window.clearTimeout(timer);
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, resetTimer));
    };
  }, [isDesktop, collapsed, setCollapsed]);

  useEffect(() => {
    if (!isDesktop) {
      setCollapsed(false);
    }
  }, [isDesktop, setCollapsed]);

  const navItems = useMemo(
    () => [
      { label: 'Home', path: '/dashboard', icon: HomeIcon },
      { label: 'News', path: '/insights/news', icon: NewsIcon },
      { label: 'Insights', path: '/insights/latest-research', icon: InsightsIcon },
    ],
    []
  );

  const handleNavigate = (path) => {
    navigate(path);
    if (!isDesktop) {
      setMobileOpen(false);
    }
  };

  const sharedButtonClass =
    'flex w-full items-center rounded-xl py-3 transition-all text-left font-medium';

  const sidebarBody = (
    <div
      className={`h-full overflow-hidden border-r border-emerald-900/10 dark:border-emerald-100/10 bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-md p-5 transition-[width] duration-300 ease-in-out ${
        collapsed ? 'w-28' : 'w-96'
      }`}
    >
      <div className={`mb-4 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <h2 className="text-sm uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300 font-semibold px-2">
            Navigation
          </h2>
        )}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="rounded-lg border border-gray-200 dark:border-gray-700 p-2 text-[#1C1C1E] dark:text-[#F5F5F7] hover:bg-gray-100 dark:hover:bg-[#2C2C2E]"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <MenuIcon />
        </button>
      </div>

      <nav className="flex flex-col gap-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={() => handleNavigate(item.path)}
              className={`${sharedButtonClass} ${
                isActive
                  ? 'bg-emerald-100 dark:bg-[#214338] text-emerald-900 dark:text-emerald-100'
                  : 'text-[#4f4f58] dark:text-[#b6b6c0] hover:bg-gray-100 dark:hover:bg-[#2C2C2E]'
              } ${collapsed ? 'justify-center px-0' : 'justify-start gap-3 px-4'}`}
              title={item.label}
            >
              <Icon />
              {!collapsed && <span className="text-base whitespace-nowrap">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:top-18 md:block md:z-20">
        {sidebarBody}
      </aside>

      <div className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <button
          className="absolute inset-0 bg-black/45"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation menu"
        />
        <aside className={`absolute left-0 top-0 h-full w-[90vw] max-w-96 transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-full border-r border-emerald-900/10 dark:border-emerald-100/10 bg-white dark:bg-[#1C1C1E] p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300 font-semibold px-2">
                Navigation
              </h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg border border-gray-200 dark:border-gray-700 p-2 text-[#1C1C1E] dark:text-[#F5F5F7]"
                aria-label="Close sidebar"
              >
                <CloseIcon />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavigate(item.path)}
                    className={`${sharedButtonClass} ${
                      isActive
                        ? 'bg-emerald-100 dark:bg-[#214338] text-emerald-900 dark:text-emerald-100'
                        : 'text-[#4f4f58] dark:text-[#b6b6c0] hover:bg-gray-100 dark:hover:bg-[#2C2C2E]'
                    }`}
                  >
                    <Icon />
                    <span className="text-base">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>
      </div>
    </>
  );
}

function IconWrap({ children }) {
  return (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center">{children}</span>
  );
}

function HomeIcon() {
  return (
    <IconWrap>
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5.5 10.5V20h13V10.5" />
      </svg>
    </IconWrap>
  );
}

function NewsIcon() {
  return (
    <IconWrap>
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 5.5h14.5a1.5 1.5 0 0 1 1.5 1.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5.5Z" />
        <path d="M7.5 9h9M7.5 12.5h9M7.5 16h5" />
      </svg>
    </IconWrap>
  );
}

function InsightsIcon() {
  return (
    <IconWrap>
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
        <path d="M4.5 19h15" />
        <path d="M7.5 16V9m4.5 7V5m4.5 11v-4" />
      </svg>
    </IconWrap>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export default Sidebar;
