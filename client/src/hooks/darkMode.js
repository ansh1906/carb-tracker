import React, { useEffect, useState } from 'react'

function useDarkMode() {
    const [theme, setTheme] = useState(()=>{
        const storedTheme = localStorage.getItem('theme');
        if(storedTheme) return storedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    })
    useEffect(()=>{
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
    }, [theme]);
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
    };
    return {theme, toggleTheme}
}

export default useDarkMode;
