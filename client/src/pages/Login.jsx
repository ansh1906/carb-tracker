import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

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
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div>
                <p>Don't have an account?</p>
                <p onClick={() => navigate('/register')} style={{ cursor: 'pointer', color: 'blue' }}>
                    Register
                </p>
            </div>
        </div>
    );
}

export default Login;