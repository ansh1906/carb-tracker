import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import DotGrid from '../components/test';
function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('');
    const [targetLow, setTargetLow] = useState(80);
    const [targetHigh, setTargetHigh] = useState(130);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const data = await register(name, email, password, type, targetLow, targetHigh);
            console.log('User registered successfully:', data);
            navigate('/verify-otp' , { state: { email } });
        } catch (err) {
            setError(err.message || 'Failed to register user.');
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#FAFAF9] dark:bg-[#121212] overflow-hidden">
            <div className="absolute inset-0 -z-0 overflow-hidden opacity-20">
                <DotGrid
                    dotSize={5}
                    gap={15}
                    baseColor="#2F293A"
                    activeColor="#5227FF"
                    proximity={120}
                    shockRadius={250}
                    shockStrength={5}
                    resistance={750}
                    returnDuration={1.5}
                />
            </div>

            <div className="relative z-10 w-full max-w-130 bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-xl shadow-black/5 p-8">
                <h1 className="text-2xl font-semibold text-[#1C1C1E] dark:text-[#F5F5F7] mb-6 text-center">
                    Create your account
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-[#1C1C1E] dark:text-[#F5F5F7] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                    />
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
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                        className="w-full text-lg font-medium text-[#1C1C1E] dark:text-[#F5F5F7] bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-[#2563EB]"
                    >
                        <option value="">Select diabetes type</option>
                        <option value="Type 1">Type 1</option>
                        <option value="Type 2">Type 2</option>
                        <option value="Gestational">Gestational</option>
                        <option value="Prediabetes">Prediabetes</option>
                        <option value="Other">Other</option>
                    </select>
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-medium text-[#1C1C1E] dark:text-[#F5F5F7] whitespace-nowrap">
                            Target Range
                        </h1>

                        <select
                            value={targetLow}
                            onChange={(e) => setTargetLow(Number(e.target.value))}
                            className="flex-1 text-lg font-medium text-[#1C1C1E] dark:text-[#F5F5F7] bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-[#2563EB]"
                        >
                            {Array.from({ length: 14 }, (_, i) => (i + 7) * 10).map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </select>

                        <span className="text-lg font-medium text-[#6E6E73] dark:text-[#9B9BA1]">-</span>

                        <select
                            value={targetHigh}
                            onChange={(e) => setTargetHigh(Number(e.target.value))}
                            className="flex-1 text-lg font-medium text-[#1C1C1E] dark:text-[#F5F5F7] bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-[#2563EB]"
                        >
                            {Array.from({ length: 22 }, (_, i) => (i + 13) * 10).map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </select>
                    </div>
                    

                    <button
                        type="submit"
                        className="w-full bg-[#2563EB] text-white font-medium py-3 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all"
                    >
                        Register
                    </button>
                </form>

                {error && <p className="text-sm text-red-500 mt-4 text-center">{error}</p>}

                <div className="mt-6 text-center text-sm text-[#6E6E73] dark:text-[#9B9BA1]">
                    <span>Already have an account? </span>
                    <span onClick={() => navigate('/login')} className="text-[#2563EB] font-medium cursor-pointer hover:underline">
                        Login
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Register;