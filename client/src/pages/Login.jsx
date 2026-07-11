import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import GlucoseWaveBackground from '../components/glucoseWaveBackground';

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const data = await login(email, password);
            console.log('User logged in successfully:', data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to login user.');
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#FAFAF9] dark:bg-[#121212] overflow-hidden">
            <GlucoseWaveBackground/>
            <div className="relative z-10 w-full max-w-sm bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-xl shadow-black/5 p-8">
                <h1 className="text-2xl font-semibold text-[#1C1C1E] dark:text-[#F5F5F7] mb-6 text-center">
                    Welcome Back
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-[#1C1C1E] dark:text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-[#1C1C1E] dark:text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"

                    />
                    <button 
                    type="submit"
                    className="w-full bg-[#2563EB] text-white font-medium py-3 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all"
                    >
                        Login
                    </button>
                </form>

                {error && <p className="text-sm text-red-500 mt-4 text-center">{error}</p>}

                <div className="mt-6 text-center text-sm text-[#6E6E73] dark:text-[#9B9BA1]">
                    <span>Don't have an account?</span>
                    <span onClick={() => navigate('/register')} className="text-[#2563EB] font-medium cursor-pointer hover:underline">
                        Register
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Login;