
import React from 'react';
import { Shield } from 'lucide-react';

interface AuthLayoutProps {
    title: string;
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-20">
        <div className="w-full max-w-md bg-white p-8 space-y-6">
            <div className="text-center">
                <Shield className="mx-auto" size={48} />
                <h1 className="text-5xl mt-4">{title}</h1>
            </div>
            {children}
        </div>
    </div>
);

export default AuthLayout;
