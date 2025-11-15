
import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import GoogleButton from './GoogleButton';
import type { PageContext } from '../../types';

interface LoginPageProps {
    onLogin: (email: string, password) => boolean;
    navigateTo: (page: string, context?: PageContext) => void;
    onGoogleSignIn: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, navigateTo, onGoogleSignIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!onLogin(email, password)) {
            setError('ZAP! Invalid email or password.');
        }
    };
    return (
        <AuthLayout title="Sign In!">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}
                <div><label className="block font-medium mb-1">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
                <div><label className="block font-medium mb-1">Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
                <button type="submit" className="w-full py-2">Sign In</button>
            </form>
            <div className="relative my-4"><div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div><div className="relative flex justify-center text-xs uppercase"><span className="px-2">Or continue with</span></div></div>
            <GoogleButton onClick={onGoogleSignIn} text="Sign in with Google" />
            <p className="text-center text-sm">Don't have an account? <button onClick={() => navigateTo('signup')} className="text-blue-500">Sign Up</button></p>
        </AuthLayout>
    );
};

export default LoginPage;
