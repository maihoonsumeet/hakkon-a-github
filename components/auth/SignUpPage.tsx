
import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import GoogleButton from './GoogleButton';
import type { PageContext } from '../../types';

interface SignUpPageProps {
    onInitiateSignUp: (name: string, email: string, password) => void;
    navigateTo: (page: string, context?: PageContext) => void;
    onGoogleSignIn: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onInitiateSignUp, navigateTo, onGoogleSignIn }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onInitiateSignUp(name, email, password); };

    return (
        <AuthLayout title="New Hero?">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="block font-medium mb-1">Your Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} required /></div>
                <div><label className="block font-medium mb-1">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
                <div><label className="block font-medium mb-1">Secret Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
                <button type="submit" className="w-full py-2">Continue</button>
            </form>
            <div className="relative my-4"><div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div><div className="relative flex justify-center text-xs uppercase"><span className="px-2">Or</span></div></div>
            <GoogleButton onClick={onGoogleSignIn} text="Sign up with Google" />
            <p className="text-center text-sm">Already a hero? <button onClick={() => navigateTo('login')} className="text-blue-500">Sign In</button></p>
        </AuthLayout>
    );
};

export default SignUpPage;
