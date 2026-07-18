import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DotGrid from '../components/test';
import { verifyOTP } from '../services/authService';

function VerifyOTP() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP.');
            return;
        }

        try {
            setLoading(true);

            const data = await verifyOTP(email, otp);

            console.log('OTP verified successfully:', data);

            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to verify OTP.');
        } finally {
            setLoading(false);
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

                <h1 className="text-2xl font-semibold text-[#1C1C1E] dark:text-[#F5F5F7] mb-3 text-center">
                    Verify your email
                </h1>

                <p className="text-center text-sm text-[#6E6E73] dark:text-[#9B9BA1] mb-6">
                    We sent a 6-digit OTP to
                    <br />
                    <span className="font-medium text-[#1C1C1E] dark:text-[#F5F5F7]">
                        {email}
                    </span>
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => {
                            const value = e.target.value
                                .replace(/\D/g, '')
                                .slice(0, 6);

                            setOtp(value);
                        }}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-[#1C1C1E] dark:text-[#F5F5F7] placeholder-gray-400 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#2563EB] text-white font-medium py-3 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>

                </form>

                {error && (
                    <p className="text-sm text-red-500 mt-4 text-center">
                        {error}
                    </p>
                )}

                <div className="mt-6 text-center text-sm text-[#6E6E73] dark:text-[#9B9BA1]">
                    <span>Entered the wrong email? </span>

                    <span
                        onClick={() => navigate('/register')}
                        className="text-[#2563EB] font-medium cursor-pointer hover:underline"
                    >
                        Go back
                    </span>
                </div>

            </div>
        </div>
    );
}

export default VerifyOTP;